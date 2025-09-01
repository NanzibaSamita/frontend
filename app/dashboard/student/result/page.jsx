"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ResultsPage() {
  const [result, setResult] = useState({ cgpa: null, current_semester: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/"; // redirect to login if not logged in
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/students/result",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setResult(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </main>
  );
}
