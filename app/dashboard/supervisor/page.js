"use client"

import { useState } from "react"
import { ChevronUpIcon } from "@heroicons/react/24/outline"

export default function SupervisorPage() {
  const [selectedSupervisor, setSelectedSupervisor] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [supervisorStatus, setSupervisorStatus] = useState("assigned")

  const supervisors = [
    { id: 1, name: "Aashanan Rahman", title: "Junior Lecturer" },
    { id: 2, name: "Maliha Nousin Raida", title: "Lecturer" },
    { id: 3, name: "Abu Raihan Mostofa Kamal", title: "Professor" },
    { id: 4, name: "Dr. Md. Azam Hossain", title: "Associate Professor" },
  ]

  const assignedSupervisor = { name: "Mahila Noushin Raida", title: "Lecturer" }

  const handleSupervisorSelect = (supervisor) => {
    setSelectedSupervisor(supervisor)
    setShowDropdown(false)
    setSupervisorStatus("selected")
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Supervisor</h1>
      </div>

      {/* Select Supervisor Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center text-xl font-medium text-gray-900"
            >
              Select Supervisor
              <ChevronUpIcon className="ml-2 h-5 w-5 text-gray-400" />
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {supervisors.map((supervisor) => (
                  <button
                    key={supervisor.id}
                    onClick={() => handleSupervisorSelect(supervisor)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-base font-medium text-gray-900">
                      {supervisor.name}- {supervisor.title}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 font-medium"
            disabled
          >
            Selected
          </button>
        </div>
      </div>

      {/* Supervisor Status */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">Supervisor Status</h2>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <span className="text-xl font-medium text-gray-900">Assigned</span>
            <span className="text-xl text-gray-900">{assignedSupervisor.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
