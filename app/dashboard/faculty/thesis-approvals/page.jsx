"use client";

import ThesisApprovalList from "@/components/faculty/thesis-approvals/ThesisApprovalList";
import ThesisApprovalDetails from "@/components/faculty/thesis-approvals/ThesisApprovalDetails";
import { useState } from "react";

export default function ThesisApprovalsPage() {
  const [selectedThesis, setSelectedThesis] = useState(null);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Thesis Approvals
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-10 py-8">
        {/* Thesis Approval List */}
        <ThesisApprovalList
          onSelectThesis={setSelectedThesis}
          selectedId={selectedThesis?.id}
        />

        {/* Thesis Approval Details */}
        {selectedThesis && (
          <div className="mt-8">
            <ThesisApprovalDetails thesis={selectedThesis} />
          </div>
        )}
      </div>
    </div>
  );
}
