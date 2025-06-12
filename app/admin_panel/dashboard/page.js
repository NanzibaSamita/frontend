"use client"

import { useEffect, useState } from "react"
import { AcademicCapIcon, DocumentTextIcon, UserGroupIcon, BookOpenIcon } from "@heroicons/react/24/outline"

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    setUserEmail(email || "user@example.com")
  }, [])

  const stats = [
    { name: "Active Courses", value: "3", icon: BookOpenIcon, color: "bg-blue-500" },
    { name: "Thesis Status", value: "In Progress", icon: DocumentTextIcon, color: "bg-green-500" },
    { name: "Supervisor", value: "Assigned", icon: AcademicCapIcon, color: "bg-purple-500" },
    { name: "Applications", value: "1", icon: UserGroupIcon, color: "bg-orange-500" },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="mt-1 text-sm text-gray-600">Logged in as: {userEmail}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${item.color} p-3 rounded-md`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="text-lg font-medium text-gray-900">{item.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Thesis proposal submitted</span>
              <span className="ml-auto text-gray-500">2 days ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span>Course registration completed</span>
              <span className="ml-auto text-gray-500">1 week ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span>Supervisor assigned</span>
              <span className="ml-auto text-gray-500">2 weeks ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Thesis Defense</span>
              <span className="text-red-600 font-medium">Dec 15, 2024</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Course Assignment</span>
              <span className="text-orange-600 font-medium">Nov 30, 2024</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Progress Report</span>
              <span className="text-yellow-600 font-medium">Dec 5, 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
