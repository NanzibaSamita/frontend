"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ThesisProposalDetails from "@/components/faculty/thesis-proposals/ThesisProposalDetails";

export default function ThesisProposalApprovalsPage() {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch proposals
  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8080/api/pgc/pending-proposals",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProposals(res.data || []);
    } catch (err) {
      console.error("Error fetching proposals:", err);
      setError(err.response?.data?.message || "Failed to fetch proposals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  // 🔹 Approve / Reject handler
  const handleReview = async (proposalId, status, feedback) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/pgc/pgc-review",
        { proposalId, status, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // refresh list after action
      await fetchProposals();
      setSelectedProposal(null);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err.response?.data?.message || "Review action failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Thesis Proposals</h2>

      {loading && <p>Loading proposals...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-3 gap-4">
        {/* Proposal list */}
        <div className="col-span-1 border-r pr-4">
          {proposals.length === 0 && !loading ? (
            <p>No pending proposals</p>
          ) : (
            proposals.map((p) => (
              <div
                key={p._id}
                className={`p-3 border rounded mb-2 cursor-pointer ${
                  selectedProposal?._id === p._id ? "bg-gray-200" : ""
                }`}
                onClick={() => setSelectedProposal(p)}
              >
                <p className="font-semibold">{p.student_id?.name}</p>
                <p className="text-sm text-gray-500">{p.title}</p>
              </div>
            ))
          )}
        </div>

        {/* Proposal details */}
        <div className="col-span-2">
          {selectedProposal ? (
            <ThesisProposalDetails
              proposal={selectedProposal}
              onReview={(proposalId, status, feedback) =>
                handleReview(proposalId, status, feedback)
              }
            />
          ) : (
            <p>Select a proposal to review</p>
          )}
        </div>
      </div>
    </div>
  );
}
