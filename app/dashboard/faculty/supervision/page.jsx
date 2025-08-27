"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

// Your API endpoint
const SUPERVISED_STUDENTS_URL =
  "http://localhost:8080/api/faculty/supervised-students";

export default function SupervisionRequests() {
  const [supervisedStudents, setSupervisedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // axios instance with auth header
  const api = useMemo(() => {
    const instance = axios.create({ withCredentials: true });
    instance.interceptors.request.use((cfg) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) cfg.headers.Authorization = `Bearer ${token}`;
      }
      return cfg;
    });
    return instance;
  }, []);

  useEffect(() => {
    const fetchSupervisedStudents = async () => {
      try {
        setLoading(true);
        setError("");

        if (typeof window !== "undefined" && !localStorage.getItem("token")) {
          setError("Not authenticated: missing token. Please log in first.");
          setLoading(false);
          return;
        }

        const { data } = await api.get(SUPERVISED_STUDENTS_URL);
        const studs = (data?.students || []).map((s) => {
          const u = s._id || {};
          return {
            id: s._id,
            name:
              [u.first_name, u.last_name].filter(Boolean).join(" ") ||
              s.name ||
              "Student",
            program: s.program || "MSc in CSE",
            startDate: s.start_date
              ? new Date(s.start_date).toLocaleDateString()
              : "—",
            title: s.thesisProposal?.title || "—",
            progress: typeof s.progress === "number" ? s.progress : 0,
          };
        });
        setSupervisedStudents(studs);
      } catch (e) {
        const status = e?.response?.status;
        const text = e?.response?.statusText;
        const msg =
          e?.response?.data?.message || e?.response?.data?.error || e.message;
        setError(`Failed to load. ${status ?? ""} ${text ?? ""} — ${msg}`);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisedStudents();
  }, [api]);

  if (loading) return <div className="p-10">Loading…</div>;
  if (error) return <div className="p-10 text-red-600">{error}</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
        Supervised Students
      </h1>

      <div className="bg-white border rounded-lg p-6 shadow">
        {supervisedStudents.length === 0 ? (
          <p className="text-sm text-gray-600">No students yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {supervisedStudents.map((student) => (
              <div key={student.id} className="border rounded-md p-5 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {student.name}
                    </h3>
                    <span className="inline-block mb-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {student.program}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Since: {student.startDate}
                  </p>
                </div>
                <p className="text-sm mb-1 text-gray-900 font-semibold">
                  Thesis Title
                </p>
                <p className="text-sm mb-2 text-gray-700">{student.title}</p>
                <div className="mt-3">
                  <div className="flex justify-between">
                    <p className="text-sm mb-1 text-gray-900 font-semibold">
                      Progress
                    </p>
                    <span className="text-sm font-semibold text-gray-900">
                      {student.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded-full">
                    <div
                      className="h-3 bg-blue-500 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    />
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
        )}
      </div>
    </div>
  );
}
