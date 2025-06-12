"use client"
import { CheckIcon } from "@heroicons/react/24/solid"

export default function StudentThesis() {
  const steps = [
    { id: 1, name: "Supervisor\nSelection", status: "completed" },
    { id: 2, name: "Proposal\nSubmission", status: "completed" },
    { id: 3, name: "PGC\nReview", status: "completed" },
    { id: 4, name: "CASR\nReview", status: "upcoming" },
    { id: 5, name: "Thesis\nSubmission", status: "upcoming" },
    { id: 6, name: "Defense\nScheduled", status: "upcoming" },
  ]

  const handleFileUpload = (type) => {
    alert(`${type} upload functionality would be implemented here`)
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Thesis</h1>
      </div>

      {/* Action Cards */}
      <div className="space-y-6">
        {/* Submit Thesis Proposal */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium text-gray-900">Submit Thesis Proposal</h3>
            <button
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 font-medium"
              disabled
            >
              Submitted
            </button>
          </div>
        </div>

        {/* Submit Thesis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium text-gray-900">Submit Thesis</h3>
            <button
              onClick={() => handleFileUpload("Final Thesis")}
              className="px-6 py-2 bg-white text-gray-700 rounded-lg border border-green-500 font-medium hover:bg-green-50 transition-colors"
            >
              Upload Document
            </button>
          </div>
        </div>

        {/* Schedule Defense */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium text-gray-900">Schedule Defense</h3>
            <button
              onClick={() => alert("Defense scheduling functionality would be implemented here")}
              className="px-6 py-2 bg-white text-gray-700 rounded-lg border border-green-500 font-medium hover:bg-green-50 transition-colors"
            >
              Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Thesis Status */}
      <div className="space-y-6">
        <h2 className="text-4xl font-bold text-gray-900">Thesis Status</h2>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200"></div>
            <div className="absolute top-8 left-0 w-1/2 h-0.5 bg-green-500"></div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  {/* Circle */}
                  <div className={`progress-step ${step.status}`}>
                    {step.status === "completed" && <CheckIcon className="w-2.5 h-2.5 text-white" />}
                  </div>

                  {/* Label */}
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium text-gray-900 whitespace-pre-line">{step.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
