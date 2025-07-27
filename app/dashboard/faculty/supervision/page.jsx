"use client"

import { useState } from "react"

export default function SupervisionRequests() {
  const [pendingRequests, setPendingRequests] = useState([
    {
      name: "Sadika Tabassum",
      id: "220042147",
      program: "MSc in CSE",
      date: "16-08-2025",
      area: "Machine Learning",
      title: "Machine Learning Applications in Healthcare Diagnosis",
      motivation: "Passionate about applying ML to solve real-world healthcare problems.",
      contact: "sadikaTabassum@iut-dhaka.edu",
    },
  ])

  const [supervisedStudents, setSupervisedStudents] = useState([
    {
      name: "Nanziba Samita",
      id: "220042155",
      program: "MSc in CSE",
      startDate: "09-01-2025",
      title: "Deep Learning for Medical Image Analysis",
      progress: 75,
    },
    {
      name: "Ayesha Mashiat",
      id: "220042156",
      program: "MSc in CSE",
      startDate: "09-01-2025",
      title: "Federated Learning in Edge Computing",
      progress: 45,
    },
  ])

  return (
    <div className="p-10">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">Supervision Requests</h1>

      {/* Top Status */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatusCard label="Pending Requests" count={pendingRequests.length} />
        <StatusCard label="Current PhD Students" count={1} />
        <StatusCard label="Current MSc Students" count={2} />
      </div>

      {/* Pending Requests */}
      <div className="bg-white border rounded-lg p-6 shadow mb-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Pending Supervision Requests</h2>
        {pendingRequests.map((req, i) => (
          <div key={i} className="border p-6 rounded-lg bg-white">
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{req.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{req.id}</p>
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mb-3">
                  {req.program}
                </span>
              </div>
              <p className="text-sm text-gray-500">Requested: {req.date}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-800 font-semibold mb-1">Research Area:</p>
                <p className="text-sm text-gray-800 mb-3">{req.area}</p>
                <p className="text-sm text-gray-800 font-semibold mb-1">Proposed Thesis Title:</p>
                <p className="text-sm text-gray-800">{req.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-800 font-semibold mb-1">Motivation</p>
                <p className="text-sm text-gray-800 mb-3">{req.motivation}</p>
                <p className="text-sm text-gray-800 font-semibold mb-1">Contact:</p>
                <p className="text-sm text-gray-800">{req.contact}</p>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-bold">
                Accept
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-bold">
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Currently Supervised Students */}
      <div className="bg-white border rounded-lg p-6 shadow">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Currently Supervised Students</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {supervisedStudents.map((student, i) => (
            <div key={i} className="border rounded-md p-5 bg-white">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{student.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{student.id}</p>
                  <span className="inline-block mb-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    {student.program}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Since: {student.startDate}</p>
              </div>
              <p className="text-sm mb-1 text-gray-900 font-semibold">Thesis Title</p>
              <p className="text-sm mb-2 text-gray-700">{student.title}</p>
              <div className="mt-3">
                <div className="flex justify-between">
                  <p className="text-sm mb-1 text-gray-900 font-semibold">Progress</p>
                  <span className="text-sm font-semibold text-gray-900">{student.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full">
                  <div className="h-3 bg-blue-500 rounded-full" style={{ width: `${student.progress}%` }}></div>
                </div>
                <div className="flex justify-center">
                  <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                    View Progress
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatusCard({ label, count }) {
  const colorClass = label === "Pending Requests" ? "text-amber-600" : "text-blue-900"

  return (
    <div className="bg-white shadow p-4 rounded text-center border">
      <p className={`text-2xl font-bold ${colorClass}`}>{count}</p>
      <p className="text-sm font-semibold text-gray-800 mt-1">{label}</p>
    </div>
  )
}
