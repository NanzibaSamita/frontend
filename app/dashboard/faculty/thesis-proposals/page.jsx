"use client";
import ThesisProposalList from "@/components/faculty/thesis-proposals/ThesisProposalList";
import ThesisProposalDetails from "@/components/faculty/thesis-proposals/ThesisProposalDetails";
import { useState } from "react";

export default function ThesisProposalApprovalsPage() {
  const [selectedProposal, setSelectedProposal] = useState(null);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Thesis Proposal Approvals
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-10 py-8">
        <ThesisProposalList
          onSelectProposal={setSelectedProposal}
          selectedId={selectedProposal?.id}
        />

        {selectedProposal && (
          <div className="mt-8">
            <ThesisProposalDetails proposal={selectedProposal} />
          </div>
        )}
      </div>
    </div>
  );
}
