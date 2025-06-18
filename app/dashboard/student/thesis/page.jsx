"use client"

import { useState } from "react"

export default function ThesisPage() {
  const [thesisProposalStatus, setThesisProposalStatus] = useState("Submit")
  const [thesisStatus, setThesisStatus] = useState("Upload Document")
  const [defenseStatus, setDefenseStatus] = useState("Schedule")

  const handleThesisProposalSubmit = () => {
    setThesisProposalStatus("Submitted")
  }

  const handleThesisSubmit = () => {
    setThesisStatus("Submitted")
  }

  const handleScheduleDefense = () => {
    setDefenseStatus("Scheduled")
  }

  return (
    <main className="flex-1 p-8">
      {/* Thesis Heading - Outside the box */}
      <h2 className="text-3xl font-semibold text-black mb-8">Thesis</h2>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Thesis Actions (inside the box) */}
        <div className="space-y-4">
          {/* Submit Thesis Proposal */}
          <div className="flex items-center justify-between">
            <span className={`text-lg ${thesisProposalStatus === "Submitted" ? "text-green-600" : "text-black"}`}>
              {thesisProposalStatus === "Submitted" ? "Submitted" : "Submit Thesis Proposal"}
            </span>
            <button
              onClick={handleThesisProposalSubmit}
              className="w-[250px] py-3 px-6 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
              disabled={thesisProposalStatus === "Submitted"}
            >
              {thesisProposalStatus === "Submit"
                ? "Upload Document"
                : "Submitted"}
            </button>
          </div>

          {/* Submit Thesis */}
          <div className="flex items-center justify-between">
            <span className={`text-lg ${thesisStatus === "Submitted" ? "text-green-600" : "text-black"}`}>
              {thesisStatus === "Submitted" ? "Submitted" : "Submit Thesis"}
            </span>
            <button
              onClick={handleThesisSubmit}
              className="w-[250px] py-3 px-6 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
              disabled={thesisStatus === "Submitted"}
            >
              {thesisStatus === "Upload Document" ? "Upload Document" : "Submitted"}
            </button>
          </div>

          {/* Schedule Defense */}
          <div className="flex items-center justify-between">
            <span className={`text-lg ${defenseStatus === "Scheduled" ? "text-green-600" : "text-black"}`}>
              {defenseStatus === "Scheduled" ? "Scheduled" : "Schedule Defence"}
            </span>
            <button
              onClick={handleScheduleDefense}
              className="w-[250px] py-3 px-6 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
              disabled={defenseStatus === "Scheduled"}
            >
              {defenseStatus === "Schedule" ? "Schedule" : "Scheduled"}
            </button>
          </div>
        </div>
      </div>

      {/* Thesis Status (Outside the box) */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-black mb-4">Thesis Status</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
            <span className="text-lg text-black">Supervisor Selection</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
            <span className="text-lg text-black">Proposal Submission</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
            <span className="text-lg text-black">PGC Review</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
            <span className="text-lg text-black">CASR Review</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
            <span className="text-lg text-black">Thesis Submission</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
            <span className="text-lg text-black">Defence Scheduled</span>
          </div>
        </div>
      </div>
    </main>
  )
}
