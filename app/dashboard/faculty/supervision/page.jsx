"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";

const SUPERVISOR_REQUESTS_URL =
  "http://localhost:8080/api/faculty/supervisor-requests";
const SUPERVISOR_RESPOND_URL =
  "http://localhost:8080/api/faculty/supervisor-respond";
const SUPERVISED_STUDENTS_URL =
  "http://localhost:8080/api/faculty/supervised-students";

// Known-good per your routes:
const STUDENTS_BASE_URL = "http://localhost:8080/api/students";

// We’ll probe these to find the “getAllStudents” style endpoint that your app actually exposes.
// (Controller exists; exact route path varies per project wiring.)
const CANDIDATE_ALL_STUDENTS_ENDPOINTS = [
  "http://localhost:8080/api/users/students",
  "http://localhost:8080/api/admin/students",
  "http://localhost:8080/api/users/getAllStudents",
  "http://localhost:8080/api/users/all-students",
];

export default function SupervisionRequests() {
  const [requests, setRequests] = useState([]);
  const [supervised, setSupervised] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const degreeBadge = (program) => {
    if (!program) return "—";
    if (typeof program === "object") {
      const type = program.degree_type || "";
      const code = program.program_code || program.program_name || "";
      return type && code ? `${type} in ${code}` : type || code || "—";
    }
    const code = String(program).toUpperCase();
    if (code.includes("PH")) return "PhD";
    if (code === "CSE") return "MSc in CSE";
    if (code === "SWE") return "MSc in SWE";
    return program;
  };

  const isPhD = (p) =>
    p &&
    (typeof p === "object"
      ? (p.degree_type || "").toLowerCase().includes("phd") ||
        (p.program_name || p.program_code || "").toLowerCase().includes("phd")
      : /phd/i.test(String(p)));

  const isMSc = (p) =>
    p &&
    (typeof p === "object"
      ? (p.degree_type || "").toLowerCase().startsWith("msc")
      : !/phd/i.test(String(p)));

  // Try /api/students/:id first; if that fails, we’ll use the “index” below.
  const fetchStudentDetail = async (id) => {
    try {
      const res = await api.get(`${STUDENTS_BASE_URL}/${id}`);
      return res?.data || null;
    } catch {
      return null;
    }
  };

  // Probe a working “all students” endpoint (wired to userController.getAllStudents)
  const findAndBuildStudentIndex = async () => {
    for (const url of CANDIDATE_ALL_STUDENTS_ENDPOINTS) {
      try {
        const res = await api.get(url);
        // Expect either: { students: [...] } or [...] directly
        const list = Array.isArray(res.data?.students)
          ? res.data.students
          : Array.isArray(res.data)
          ? res.data
          : [];
        if (!Array.isArray(list) || list.length === 0) continue;

        // Build an index: Student._id -> { first_name, last_name, email }
        const index = new Map();
        for (const u of list) {
          const sid = u?.student_details?._id; // that’s how your aggregation shapes it
          if (sid) {
            index.set(String(sid), {
              first_name: u.first_name,
              last_name: u.last_name,
              email: u.email,
            });
          }
        }
        if (index.size > 0) return index;
      } catch (e) {
        // try next candidate
        continue;
      }
    }
    return new Map();
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (typeof window !== "undefined" && !localStorage.getItem("token")) {
        setError("Not authenticated: missing token. Please log in first.");
        setLoading(false);
        return;
      }

      // 1) pending requests
      const reqRes = await api.get(SUPERVISOR_REQUESTS_URL);
      const rawRequests = reqRes?.data?.requests ?? [];

      // 2) fetch a student index once
      const studentIndex = await findAndBuildStudentIndex();

      // 3) enrich each request with user data
      const enriched = await Promise.all(
        rawRequests.map(async (r) => {
          const s = r?.student_id || {};
          const sid = s?._id || r?.student_id;

          // First try the indexed user info (fast, single bulk call)
          let ui = sid ? studentIndex.get(String(sid)) : null;

          // If index was empty or didn’t have this student, fall back to /students/:id
          if (!ui && sid) {
            const detail = await fetchStudentDetail(sid);
            const user = detail?.user_id;
            if (user && typeof user === "object") {
              ui = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
              };
            }
          }

          return { ...r, _userInfo: ui || null };
        })
      );

      // 4) current supervised students
      const supRes = await api.get(SUPERVISED_STUDENTS_URL);
      const supervisedStudents = supRes?.data?.students ?? [];

      setRequests(enriched);
      setSupervised(supervisedStudents);
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
  }, [api]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const respond = async (assignmentId, response) => {
    try {
      setError("");
      await api.post(SUPERVISOR_RESPOND_URL, { assignmentId, response });
      await loadData();
    } catch (e) {
      const status = e?.response?.status;
      const text = e?.response?.statusText;
      const msg =
        e?.response?.data?.message || e?.response?.data?.error || e.message;
      setError(`Action failed. ${status ?? ""} ${text ?? ""} — ${msg}`);
      console.error(e);
    }
  };

  const onAccept = (req) => respond(req._id, "Accepted");
  const onDecline = (req) => respond(req._id, "Rejected");

  const pendingCount = requests.length;
  const currentPhDCount = supervised.filter((s) => isPhD(s.program_id)).length;
  const currentMScCount = supervised.filter((s) => isMSc(s.program_id)).length;

  if (loading) return <div className="p-10">Loading…</div>;
  if (error) return <div className="p-10 text-red-600">{error}</div>;

  return (
    <div className="p-6 md:p-10 msx-h-screen overflow-y-auto overflow-x-auto">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-8 text-gray-900">
        Supervision Requests
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="border border-[#C3BEBE] rounded-md p-5 text-black flex flex-col justify-center items-center">
          <div className="text-2xl font-semibold">{pendingCount}</div>
          <div className="text-sm text-gray-700">Pending Requests</div>
        </div>
        <div className="border border-[#C3BEBE] rounded-md p-5 text-black flex flex-col justify-center items-center">
          <div className="text-2xl font-semibold">{currentPhDCount}</div>
          <div className="text-sm text-gray-700">Current PhD Students</div>
        </div>
        <div className="border border-[#C3BEBE] rounded-md p-5 text-black flex flex-col justify-center items-center">
          <div className="text-2xl font-semibold">{currentMScCount}</div>
          <div className="text-sm text-gray-700">Current MSc Students</div>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-white border rounded-lg p-6 shadow mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">
          Pending Supervision Requests
        </h2>

        {pendingCount === 0 ? (
          <p className="text-sm text-gray-600">No pending requests.</p>
        ) : (
          requests.map((req) => {
            const sRaw = req.student_id || {};
            const u = req._userInfo || {}; // {first_name, last_name, email}

            const fullName =
              [u.first_name, u.last_name].filter(Boolean).join(" ") || "—";
            const email = u.email || "—";
            const studentNumber = sRaw.student_number || "—";
            const programForBadge = sRaw.program_id ?? null;

            const creditsCompleted = Number.isFinite(
              Number(sRaw?.obtained_credits)
            )
              ? Number(sRaw.obtained_credits)
              : 0;

            const cgpaVal = Number.isFinite(Number(sRaw?.cgpa))
              ? Number(sRaw.cgpa)
              : null;
            const cgpaDisplay = cgpaVal === null ? "—" : cgpaVal.toFixed(2);

            return (
              <div
                key={req._id}
                className="border rounded-md p-5 bg-white mb-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {fullName}
                    </h3>
                    <span className="inline-block mb-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {degreeBadge(programForBadge)}
                    </span>
                    <div className="text-xs text-gray-600">
                      ID: {studentNumber}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Requested: {formatDate(req.createdAt)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm mb-1 text-gray-900 font-semibold">
                      Credits Completed
                    </p>
                    <p className="text-sm text-gray-700">{creditsCompleted}</p>

                    <p className="text-sm mt-3 mb-1 text-gray-900 font-semibold">
                      CGPA
                    </p>
                    <p className="text-sm text-gray-700">{cgpaDisplay}</p>
                  </div>

                  <div>
                    <p className="text-sm mb-1 text-gray-900 font-semibold">
                      Contact
                    </p>
                    <p className="text-sm text-gray-700">{email}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => onAccept(req)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onDecline(req)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Decline
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Currently Supervised Students */}
      <div className="bg-white border rounded-lg p-6 shadow">
        <h2 className="font-semibold text-gray-900 mb-4">
          Currently Supervised Students
        </h2>

        {supervised.length === 0 ? (
          <p className="text-sm text-gray-600">No supervised students yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supervised.map((s) => {
              const user = s.user_id || {};
              const name =
                [user.first_name, user.last_name].filter(Boolean).join(" ") ||
                "Student";
              const since = formatDate(s.admission_date);
              const thesisTitle = s?.thesisProposal?.title || "—";
              const earned = Number(s.obtained_credits || 0);
              const total = Number(s.total_credit_hours || 0);
              const pct = total > 0 ? Math.round((earned / total) * 100) : 0;

              return (
                <div key={s._id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{name}</p>
                      <p className="text-xs text-gray-600">
                        {s.student_number || "—"}
                      </p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {degreeBadge(s.program_id)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">Since: {since}</p>
                  </div>

                  <div className="text-sm">
                    <p className="text-gray-900 font-semibold mb-1">
                      Thesis Title
                    </p>
                    <p className="text-gray-700">{thesisTitle}</p>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-gray-900 font-semibold">
                      Progress
                    </p>
                    <div className="h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 rounded bg-blue-600"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-gray-600 mt-1">
                      {pct}%
                    </p>
                  </div>

                  <div className="mt-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                      View Progress
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
