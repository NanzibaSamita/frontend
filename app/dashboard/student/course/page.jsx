"use client";

import { useState, useEffect } from "react";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT token
        const res = await fetch("http://localhost:8080/api/students/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Failed to fetch courses.");
          setCourses([]);
        } else {
          setCourses(data.enrolledCourses || []);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setMessage("Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading courses...</div>;
  }

  return (
    <main className="flex-1 p-8">
      <div className="max-w-4xl mx-auto border border-gray-300 bg-white p-6 rounded-lg">
        <h2 className="text-3xl font-semibold text-black mb-8">My Courses</h2>

        {message && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-300 text-blue-800 rounded-lg">
            {message}
          </div>
        )}

        {courses.length === 0 ? (
          <p className="text-gray-600">No courses found.</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-black">Course Code</th>
                <th className="px-4 py-2 text-left text-black">Course Name</th>
                <th className="px-4 py-2 text-left text-black">Credits</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className="px-4 py-2 text-black">{course.course_code}</td>
                  <td className="px-4 py-2 text-black">{course.course_name}</td>
                  <td className="px-4 py-2 text-black">{course.credit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
