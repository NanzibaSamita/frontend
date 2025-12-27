"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ThesisProposalList from "@/components/faculty/thesis-proposals/ThesisProposalList";
import ThesisProposalDetails from "@/components/faculty/thesis-proposals/ThesisProposalDetails";

export default function ThesisProposalApprovalsPage() {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  // ✅ Fetch proposals on mount
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:8080/api/faculty/thesis-proposals",
          getAuthHeaders()
        );
        setProposals(res.data);
      } catch (err) {
        console.error("Error fetching proposals", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const handleReview = async (proposalId, status, feedback = "") => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/faculty/thesis-proposal/review",
        { proposalId, feedback, status },
        getAuthHeaders()
      );

      const updated = res?.data?.proposal;
      if (!updated?._id) throw new Error("Invalid server response");

      setProposals(prev => prev.map(p => (p._id === proposalId ? updated : p)));
      setSelectedProposal(updated); // ensures detail pane reflects new status
    } catch (err) {
      console.error("Error reviewing proposal", err);
      alert(err?.response?.data?.message || "Review failed.");
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Thesis Proposal Approvals
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-10 py-8">
        {loading ? (
          <p>Loading proposals...</p>
        ) : (
          <ThesisProposalList
            proposals={proposals}
            expandedId={selectedProposal?._id}
            onSelectProposal={setSelectedProposal}
            onReview={handleReview}
          />
        )}

      
      </div>
    </div>
  );
}
