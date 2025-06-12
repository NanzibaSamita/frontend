"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpenIcon, DocumentTextIcon, UserGroupIcon } from "@heroicons/react/24/outline"

export default function Dashboard() {
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      // Extract name from email (before @) and capitalize
      const name = email.split("@")[0]
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
      setUserName(capitalizedName)
    }
  }, [])

  const stats = [
    {
      name: "Active Courses",
      value: "3",
      icon: BookOpenIcon,
      color: "bg-blue-500",
      href: "/dashboard/courses",
    },
    {
      name: "Thesis Status",
      value: "In Progress",
      icon: DocumentTextIcon,
      color: "bg-green-500",
      href: "/dashboard/thesis",
    },
    {
      name: "Supervisor",
      value: "Assigned",
      icon: UserGroupIcon,
      color: "bg-purple-500",
      href: "/dashboard/supervisor",
    },
  ]

  const recentActivities = [
    { text: "Thesis proposal submitted", time: "2 days ago", color: "bg-green-500" },
    { text: "Course registration completed", time: "1 week ago", color: "bg-blue-500" },
    { text: "Supervisor assigned", time: "2 weeks ago", color: "bg-purple-500" },
  ]

  const upcomingDeadlines = [
    { task: "Thesis Defense", date: "Dec 15, 2024", color: "text-red-600" },
    { task: "Course Assignment", date: "Nov 30, 2024", color: "text-orange-600" },
    { task: "Progress Report", date: "Dec 5, 2024", color: "text-yellow-600" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="mt-2 text-lg text-gray-600">Welcome {userName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <Link key={item.name} href={item.href}>
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${item.color} p-3 rounded-lg`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="ml-6 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                      <dd className="text-2xl font-bold text-gray-900">{item.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activities and Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 ${activity.color} rounded-full mr-4`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{deadline.task}</span>
                <span className={`text-sm font-semibold ${deadline.color}`}>{deadline.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
