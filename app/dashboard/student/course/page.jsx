"use client";

import { useState } from "react";

export default function CoursesPage() {
  const [courseStatus, setCourseStatus] = useState({
    CSE5040: "Enroll",
    MATH4041: "Enroll",
    CSE4011: "Enroll",
    PHY4031: "Enroll",
    PHY4032: "Enroll",
  });

  const handleEnroll = (courseCode) => {
    setCourseStatus((prevStatus) => ({
      ...prevStatus,
      [courseCode]: "Enrolled",
    }));
  };

  return (
    <main className="flex-1 p-8">
      <div className="max-w-4xl mx-auto border border-gray-300 bg-white p-6 rounded-lg">
        {/* Courses Section */}
        <h2 className="text-3xl font-semibold text-black mb-8">Courses</h2>

        {/* Course Table */}
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-black">Course Code</th>
              <th className="px-4 py-2 text-left text-black">Title</th>
              <th className="px-4 py-2 text-left text-black">Credits</th>
              <th className="px-4 py-2 text-left text-black">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { code: "CSE5040", title: "Advanced Algorithms", credits: 3 },
              { code: "MATH4041", title: "Numerical Method", credits: 3 },
              { code: "CSE4011", title: "Machine Learning", credits: 3 },
              { code: "PHY4031", title: "Quantum Mechanics", credits: 4 },
              {
                code: "PHY4032",
                title: "Software Requirements & System",
                credits: 2,
              },
            ].map((course) => (
              <tr key={course.code}>
                <td className="px-4 py-2 text-black">{course.code}</td>
                <td className="px-4 py-2 text-black">{course.title}</td>
                <td className="px-4 py-2 flex items-center justify-center text-black">
                  {course.credits}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEnroll(course.code)}
                    className={`py-2 px-6 text-white font-semibold rounded-md ${
                      courseStatus[course.code] === "Enrolled"
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                    disabled={courseStatus[course.code] === "Enrolled"}
                  >
                    {courseStatus[course.code]}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
