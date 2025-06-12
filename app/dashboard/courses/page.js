"use client"

import { useState } from "react"

export default function CoursesPage() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      code: "CSE5040",
      title: "Advanced Algorithms",
      credits: 3,
      status: "available",
    },
    {
      id: 2,
      code: "MATH4041",
      title: "Numerical Method",
      credits: 3,
      status: "enrolled",
    },
    {
      id: 3,
      code: "CSE4011",
      title: "Machine Learning",
      credits: 3,
      status: "available",
    },
    {
      id: 4,
      code: "PHY4031",
      title: "Quantum Mechanics",
      credits: 4,
      status: "available",
    },
    {
      id: 5,
      code: "PHY4031",
      title: "Software Requirements & System",
      credits: 2,
      status: "available",
    },
  ])

  const handleEnroll = (courseId) => {
    setCourses(courses.map((course) => (course.id === courseId ? { ...course, status: "enrolled" } : course)))
    alert("Successfully enrolled in course!")
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Courses</h1>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-lg font-medium text-gray-900">Course Code</th>
              <th className="px-6 py-4 text-left text-lg font-medium text-gray-900">Title</th>
              <th className="px-6 py-4 text-left text-lg font-medium text-gray-900">Credits</th>
              <th className="px-6 py-4 text-left text-lg font-medium text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-base text-gray-900">{course.code}</td>
                <td className="px-6 py-4 text-base text-gray-900">{course.title}</td>
                <td className="px-6 py-4 text-base text-gray-900">{course.credits}</td>
                <td className="px-6 py-4">
                  {course.status === "enrolled" ? (
                    <span className="text-base text-gray-900">Enrolled</span>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-green-500 font-medium hover:bg-green-50 transition-colors"
                    >
                      Enroll
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
