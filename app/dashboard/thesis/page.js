"use client"
import React from "react"

export default function ThesisPage() {
  const steps = [
    "Supervisor Selection",
    "Proposal Submission",
    "PGC Review",
    "CASR Review",
    "Thesis Submission",
    "Defense Scheduled",
  ]
  const completedSteps = 3 // change this to reflect progress

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Thesis</h1>

      {/* Action Buttons */}
      <div className="space-y-6 mb-12">
        <div className="flex items-center justify-between p-6 border border-gray-300 rounded-md bg-white shadow-sm">
          <span className="text-lg font-medium text-gray-800">Submit Thesis Proposal</span>
          <button className="px-4 py-2 border border-green-600 text-green-700 rounded-md hover:bg-green-50 transition">
            Submitted
          </button>
        </div>
        <div className="flex items-center justify-between p-6 border border-gray-300 rounded-md bg-white shadow-sm">
          <span className="text-lg font-medium text-gray-800">Submit Thesis</span>
          <button className="px-4 py-2 border border-green-600 text-green-700 rounded-md hover:bg-green-50 transition">
            Upload Document
          </button>
        </div>
        <div className="flex items-center justify-between p-6 border border-gray-300 rounded-md bg-white shadow-sm">
          <span className="text-lg font-medium text-gray-800">Schedule Defense</span>
          <button className="px-4 py-2 bg-green-50 border border-green-600 text-green-700 rounded-md hover:bg-green-100 transition">
            Schedule
          </button>
        </div>
      </div>

      {/* Thesis Status */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Thesis Status</h2>

<div className="bg-white p-6 rounded-lg shadow-sm border relative overflow-hidden">
  {/* Background Line (gray full width) */}
  <div className="absolute top-[44px] left-[7%] right-[7%] h-1 bg-gray-300 z-0" />
  {/* Progress Line (green partial) */}
  <div
    className="absolute top-[44px] left-[7%] h-1 bg-green-500 z-0 transition-all duration-500"
    style={{ width: `${(3 / 5) * 100}%` }} // 3 completed out of 6
  />

  <div className="flex justify-between items-start relative z-10">
    {[
      "Supervisor Selection",
      "Proposal Submission",
      "PGC Review",
      "CASR Review",
      "Thesis Submission",
      "Defense Scheduled",
    ].map((label, idx) => {
      const isComplete = idx < 3
      return (
        <div
          key={idx}
          className="flex flex-col items-center text-center w-full shrink-0"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 text-sm font-bold shrink-0
            ${isComplete
              ? "bg-green-500 text-white"
              : "border-2 border-green-500 text-green-500 bg-white"}`}
          >
            {isComplete ? "✓" : ""}
          </div>
          <span className="text-sm text-gray-800 w-24 leading-tight">
            {label}
          </span>
        </div>
      )
    })}
  </div>
</div>
