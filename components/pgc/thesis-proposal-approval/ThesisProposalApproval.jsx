"use client";

import { useMemo, useState, useEffect } from "react";

export default function ThesisProposalApproval() {
  /* -------------------- State -------------------- */
  const [pendingProposals, setPendingProposals] = useState([]);
  const [approvedProposals, setApprovedProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPendingFor, setOpenPendingFor] = useState(null);
  const [openApprovedFor, setOpenApprovedFor] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  /* -------------------- API Functions -------------------- */
  const getAuthHeaders = () => {
    // Assuming user_id is stored somewhere for Bearer token
    const userId = window.localStorage?.getItem('user_id') || 'default_user_id';
    return {
      'Authorization': `Bearer ${userId}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch pending proposals (waiting for PGC review)
      const pendingResponse = await fetch('/api/pgc/pending-proposals', {
        headers: getAuthHeaders()
      });
      
      if (!pendingResponse.ok) {
        throw new Error(`Failed to fetch pending proposals: ${pendingResponse.statusText}`);
      }
      
      const pendingData = await pendingResponse.json();

      // Fetch approved proposals 
      const approvedResponse = await fetch('/api/pgc/approved-proposals', {
        headers: getAuthHeaders()
      });
      
      if (!approvedResponse.ok) {
        throw new Error(`Failed to fetch approved proposals: ${approvedResponse.statusText}`);
      }
      
      const approvedData = await approvedResponse.json();

      // Transform data to match frontend structure
      const transformedPending = (pendingData.proposals || []).map(transformProposal);
      const transformedApproved = (approvedData.proposals || []).map(transformProposal);

      setPendingProposals(transformedPending);
      setApprovedProposals(transformedApproved);
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const transformProposal = (proposal) => {
    return {
      id: proposal.student_id?.student_number || proposal._id,
      name: proposal.student_id?.user_id ? 
        `${proposal.student_id.user_id.first_name} ${proposal.student_id.user_id.last_name}` : 
        'Unknown Student',
      program: proposal.student_id?.program_id?.program_name || 'Unknown Program',
      title: proposal.title,
      submittedOn: new Date(proposal.createdAt).toLocaleDateString('en-GB'),
      requestedOn: new Date(proposal.createdAt).toLocaleDateString('dd-MM-yyyy'),
      researchTopic: proposal.research_topic,
      supervisor: proposal.supervisor_id?.user_id ? 
        `${proposal.supervisor_id.user_id.first_name} ${proposal.supervisor_id.user_id.last_name}` : 
        'Unknown Supervisor',
      objective: proposal.objective,
      background: proposal.background,
      methodology: proposal.methodology,
      timeline: proposal.timeline,
      estimatedCost: proposal.estimated_cost,
      references: proposal.references,
      attachments: proposal.attachment ? 
        [{ label: proposal.attachment, url: `#${proposal.attachment}` }] : [],
      contact: proposal.student_id?.user_id?.email || 'No email',
      proposalId: proposal._id,
      feedback: proposal.feedback,
      feedbackHistory: proposal.feedbackHistory || []
    };
  };

  const handleProposalAction = async (proposalId, action, feedback = '') => {
    try {
      setActionLoading(true);
      setError(null);

      const response = await fetch('/api/pgc/review-proposal', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          proposalId,
          feedback,
          status: action // 'Approved', 'Rejected', or 'Comment'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action.toLowerCase()} proposal: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Refresh the proposals list
      await fetchProposals();
      
      // Close any open details
      setOpenPendingFor(null);
      setOpenApprovedFor(null);

      alert(`Proposal ${action.toLowerCase()} successfully!`);
    } catch (err) {
      console.error(`Error ${action.toLowerCase()} proposal:`, err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  /* -------------------- Effects -------------------- */
  useEffect(() => {
    fetchProposals();
  }, []);

  /* -------------------- Render -------------------- */
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="text-lg">Loading proposals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={fetchProposals}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Thesis Proposal Approvals</h1>
        <button
          onClick={fetchProposals}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Pending */}
      <Card title={`Pending Thesis Proposals (${pendingProposals.length})`} className="mb-8">
        {pendingProposals.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">
            No pending proposals for review.
          </div>
        ) : (
          <Table
            headers={[
              "Student",
              "ID", 
              "Program",
              "Proposed Title",
              "Submitted on",
              "",
            ]}
          >
            {pendingProposals.map((p) => (
              <tr key={p.proposalId} className="border-t">
                <Td className="whitespace-pre-wrap">{p.name}</Td>
                <Td>{p.id}</Td>
                <Td className="whitespace-pre-wrap">{p.program}</Td>
                <Td className="whitespace-pre-wrap">{p.title}</Td>
                <Td>{p.submittedOn}</Td>
                <Td className="text-right">
                  <button
                    onClick={() =>
                      setOpenPendingFor((cur) => (cur?.proposalId === p.proposalId ? null : p))
                    }
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                    disabled={actionLoading}
                  >
                    {openPendingFor?.proposalId === p.proposalId ? "Hide" : "View"}
                  </button>
                </Td>
              </tr>
            ))}
          </Table>
        )}

        {openPendingFor && (
          <DetailsBlock
            summary={{
              student: openPendingFor.name,
              id: openPendingFor.id,
              program: openPendingFor.program,
              title: openPendingFor.title,
              date: openPendingFor.submittedOn,
            }}
            leftTitle="Thesis Proposal Details"
            showActions={true}
            dataLeft={[
              { label: "Name", value: openPendingFor.name },
              { label: "ID", value: openPendingFor.id },
              { label: "Research Topic", value: openPendingFor.researchTopic },
              { label: "Proposed Title", value: openPendingFor.title },
              { label: "Background", value: openPendingFor.background },
              { label: "Methodology", value: openPendingFor.methodology },
              { label: "Timeline", value: openPendingFor.timeline || "-" },
              { label: "Estimated Cost", value: openPendingFor.estimatedCost || "-" },
              { label: "References", value: openPendingFor.references || "-" },
              {
                label: "Attachments",
                value:
                  openPendingFor.attachments?.length > 0 ? (
                    openPendingFor.attachments.map((a) => (
                      <a
                        key={a.label}
                        href={a.url}
                        className="text-blue-600 hover:underline block"
                      >
                        {a.label}
                      </a>
                    ))
                  ) : "-",
              },
            ]}
            dataRight={[
              { label: "Supervisor", value: openPendingFor.supervisor },
              { label: "Objective", value: openPendingFor.objective },
              { label: "Contact", value: openPendingFor.contact },
              { label: "Submitted", value: openPendingFor.requestedOn },
              { label: "Current Status", value: "Waiting for PGC Review" },
              { 
                label: "Previous Feedback", 
                value: openPendingFor.feedbackHistory?.length > 0 ? 
                  openPendingFor.feedbackHistory.map((f, i) => (
                    <div key={i} className="text-xs bg-gray-50 p-2 mb-1 rounded">
                      <div className="font-medium">{f.status} - {new Date(f.date).toLocaleDateString()}</div>
                      <div>{f.feedback}</div>
                    </div>
                  )) : "No previous feedback"
              },
            ]}
            onComment={(feedback) => handleProposalAction(openPendingFor.proposalId, 'Comment', feedback)}
            onApprove={(feedback) => handleProposalAction(openPendingFor.proposalId, 'Approved', feedback)}
            onReject={(feedback) => handleProposalAction(openPendingFor.proposalId, 'Rejected', feedback)}
            actionLoading={actionLoading}
          />
        )}
      </Card>

      {/* Approved */}
      <Card title={`Approved Thesis Proposals (${approvedProposals.length})`}>
        {approvedProposals.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">
            No approved proposals yet.
          </div>
        ) : (
          <Table
            headers={[
              "Student",
              "ID",
              "Program", 
              "Proposed Title",
              "Approved on",
              "",
            ]}
          >
            {approvedProposals.map((a) => (
              <tr key={a.proposalId} className="border-t">
                <Td className="whitespace-pre-wrap">{a.name}</Td>
                <Td>{a.id}</Td>
                <Td className="whitespace-pre-wrap">{a.program}</Td>
                <Td className="whitespace-pre-wrap">{a.title}</Td>
                <Td>{a.submittedOn}</Td>
                <Td className="text-right">
                  <button
                    onClick={() =>
                      setOpenApprovedFor((cur) => (cur?.proposalId === a.proposalId ? null : a))
                    }
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    {openApprovedFor?.proposalId === a.proposalId ? "Hide" : "View"}
                  </button>
                </Td>
              </tr>
            ))}
          </Table>
        )}

        {openApprovedFor && (
          <DetailsBlock
            summary={{
              student: openApprovedFor.name,
              id: openApprovedFor.id,
              program: openApprovedFor.program,
              title: openApprovedFor.title,
              date: openApprovedFor.submittedOn,
            }}
            leftTitle="Thesis Proposal Details"
            showActions={false} // no actions for approved
            dataLeft={[
              { label: "Name", value: openApprovedFor.name },
              { label: "ID", value: openApprovedFor.id },
              { label: "Research Topic", value: openApprovedFor.researchTopic },
              { label: "Proposed Title", value: openApprovedFor.title },
              { label: "Background", value: openApprovedFor.background },
              { label: "Methodology", value: openApprovedFor.methodology },
              { label: "Timeline", value: openApprovedFor.timeline || "-" },
              { label: "Estimated Cost", value: openApprovedFor.estimatedCost || "-" },
              { label: "References", value: openApprovedFor.references || "-" },
              {
                label: "Attachments",
                value:
                  openApprovedFor.attachments?.length > 0 ? (
                    openApprovedFor.attachments.map((a) => (
                      <a
                        key={a.label}
                        href={a.url}
                        className="text-blue-600 hover:underline block"
                      >
                        {a.label}
                      </a>
                    ))
                  ) : "-",
              },
            ]}
            dataRight={[
              { label: "Supervisor", value: openApprovedFor.supervisor },
              { label: "Objective", value: openApprovedFor.objective },
              { label: "Contact", value: openApprovedFor.contact },
              { label: "Approved", value: openApprovedFor.requestedOn },
              { label: "Status", value: "PGC Approved" },
              { 
                label: "Final Feedback", 
                value: openApprovedFor.feedback || "No feedback provided"
              },
            ]}
          />
        )}
      </Card>
    </div>
  );
}

/* ==================== Details Block ==================== */
function DetailsBlock({
  summary,
  leftTitle,
  dataLeft,
  dataRight,
  showActions = true,
  onComment,
  onApprove,
  onReject,
  actionLoading = false
}) {
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);

  const handleActionClick = (action) => {
    setCurrentAction(action);
    setShowFeedbackInput(true);
  };

  const submitAction = () => {
    if (currentAction === 'Comment') {
      onComment(feedbackText);
    } else if (currentAction === 'Approved') {
      onApprove(feedbackText);
    } else if (currentAction === 'Rejected') {
      onReject(feedbackText);
    }
    
    setFeedbackText('');
    setShowFeedbackInput(false);
    setCurrentAction(null);
  };

  return (
    <div className="mt-6 border rounded bg-white">
      {/* Summary bar */}
      <div className="rounded border m-4 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <Th>Student</Th>
              <Th>ID</Th>
              <Th>Program</Th>
              <Th>Proposed Title</Th>
              <Th>Submitted on</Th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <Td>{summary.student}</Td>
              <Td>{summary.id}</Td>
              <Td>{summary.program}</Td>
              <Td>{summary.title}</Td>
              <Td>{summary.date}</Td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <InfoCard title={leftTitle}>
          {dataLeft.map((row) => (
            <InfoRow key={row.label} label={row.label} value={row.value} />
          ))}
        </InfoCard>

        <InfoCard title="Supervisor & Additional Info">
          {dataRight.map((row) => (
            <InfoRow key={row.label} label={row.label} value={row.value} />
          ))}
        </InfoCard>
      </div>

      {/* Feedback Input */}
      {showFeedbackInput && (
        <div className="mx-4 mb-4 p-4 bg-gray-50 rounded border">
          <div className="mb-2 font-medium">
            {currentAction === 'Comment' ? 'Add Comment' : 
             currentAction === 'Approved' ? 'Approval Feedback (Optional)' :
             'Rejection Feedback (Required)'}
          </div>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder={
              currentAction === 'Comment' ? 'Enter your comment...' :
              currentAction === 'Approved' ? 'Optional approval notes...' :
              'Please provide reason for rejection...'
            }
            className="w-full p-2 border rounded h-24 resize-none"
            disabled={actionLoading}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={submitAction}
              disabled={actionLoading || (currentAction === 'Rejected' && !feedbackText.trim())}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm disabled:opacity-50"
            >
              {actionLoading ? 'Processing...' : `Submit ${currentAction}`}
            </button>
            <button
              onClick={() => {
                setShowFeedbackInput(false);
                setCurrentAction(null);
                setFeedbackText('');
              }}
              disabled={actionLoading}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {showActions && !showFeedbackInput && (
        <div className="flex gap-3 px-4 pb-4">
          <button
            onClick={() => handleActionClick('Comment')}
            disabled={actionLoading}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            Comment
          </button>
          <button
            onClick={() => handleActionClick('Approved')}
            disabled={actionLoading}
            className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => handleActionClick('Rejected')}
            disabled={actionLoading}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

/* ==================== Small UI helpers ==================== */
function Card({ title, className = "", children }) {
  return (
    <div className={`bg-white rounded shadow-sm border ${className}`}>
      <div className="px-5 py-4 border-b font-semibold">{title}</div>
      <div>{children}</div>
    </div>
  );
}

function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-700">
            {headers.map((h, i) => (
              <th key={i} className="text-left font-medium px-5 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">{children}</tbody>
      </table>
    </div>
  );
}

function Th({ children }) {
  return <th className="text-left px-3 py-2">{children}</th>;
}

function Td({ className = "", children }) {
  return <td className={`px-5 py-3 align-top ${className}`}>{children}</td>;
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded border">
      <div className="bg-gray-50 px-3 py-2 text-sm font-medium">{title}</div>
      <table className="w-full text-sm">
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <tr className="border-t">
      <td className="w-44 sm:w-56 text-gray-600 px-3 py-2 align-top">{label}</td>
      <td className="px-3 py-2">{value || "-"}</td>
    </tr>
  );
}