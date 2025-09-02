"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ResultsPage() {
  const [result, setResult] = useState({
    cgpa: null,
    current_semester: null,
    obtained_credits: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/"; // redirect if not logged in
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/students/result",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setResult(response.data);
        setStudentId(response.data.student_id); // backend should send student_id
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  const handleEditCGPA = async () => {
    const cgpa = parseFloat(prompt("Enter new CGPA (0 - 4):"));
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 4) {
      alert("Invalid CGPA. Must be between 0 and 4.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:8080/api/admin/student/${studentId}/edit-cgpa`,
        { cgpa },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "CGPA updated");
      setResult((prev) => ({ ...prev, cgpa }));
    } catch (err) {
      console.error(err);
      alert("Failed to update CGPA.");
    }
  };

  const handleEditCredits = async () => {
    const credits = parseInt(prompt("Enter new obtained credits:"), 10);
    if (isNaN(credits) || credits < 0) {
      alert("Invalid credits. Must be a non-negative number.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:8080/api/admin/student/${studentId}/edit-credits`,
        { obtained_credits: credits },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Credits updated");
      setResult((prev) => ({ ...prev, obtained_credits: credits }));
    } catch (err) {
      console.error(err);
      alert("Failed to update credits.");
    }
  };

  if (loading)
    return <p className="text-center mt-6 text-gray-600">Loading result...</p>;

  if (error)
    return (
      <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-50 border border-red-300 text-red-800 rounded-lg text-center">
        {error}
      </div>
    );

  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-black mb-6 text-center">
          Academic Result
        </h2>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow-sm text-center">
            <p className="text-lg font-medium">Current Semester</p>
            <p className="text-2xl font-bold mt-2">{result.current_semester}</p>
          </div>

          <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow-sm text-center">
            <p className="text-lg font-medium">Obtained Credits</p>
            <p className="text-2xl font-bold mt-2">{result.obtained_credits}</p>
          </div>

          <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow-sm text-center">
            <p className="text-lg font-medium">CGPA</p>
            <p className="text-2xl font-bold mt-2">{result.cgpa}</p>
          </div>
        </div>

        {/* Action Buttons */}
        {studentId && (
          <div className="flex justify-center gap-4">
            <button
              onClick={handleEditCGPA}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit CGPA
            </button>
            <button
              onClick={handleEditCredits}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Edit Credits
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
