"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddFacultyPage() {
  const [form, setForm] = useState({
    user_id: "",            // <-- employee/faculty ID typed by user
    email: "",
    first_name: "",
    last_name: "",
    department: "",
    designation: "",
    specialization: "",
    research_interests: "",
  });
  const [loading, setLoading] = useState(false);
  const [creds, setCreds] = useState(null); // backend returns {credentials:{email,password}}
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCreds(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in as admin to perform this action.");
        setLoading(false);
        return;
      }

      // 🔗 Map frontend field to backend contract:
      // frontend: user_id  -> backend: faculty_number
      const payload = {
        faculty_number: form.user_id,
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        department: form.department,
        designation: form.designation,
        specialization: form.specialization,
        research_interests: form.research_interests,
      };

      const res = await fetch("http://localhost:8080/api/admin/create-faculty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Failed to create faculty.");
        setLoading(false);
        return;
      }

      setCreds(data?.credentials || null);
      alert(data?.message || "Faculty created successfully!");

      // Clear the form
      setForm({
        user_id: "",
        email: "",
        first_name: "",
        last_name: "",
        department: "",
        designation: "",
        specialization: "",
        research_interests: "",
      });

      // Optional redirect:
      // router.push("/dashboard/admin/faculty/list");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-black mb-2">Add Faculty</h1>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Employee / Faculty ID -> user_id */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Employee ID</label>
              <input
                type="text"
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                placeholder="e.g., FAC11231001"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Department */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Business">Business</option>
              </select>
            </div>

            {/* Designation */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Designation</label>
              <select
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Designation</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Professor">Professor</option>
              </select>
            </div>

            {/* Specialization (optional) */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700">Specialization (optional)</label>
              <input
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                placeholder="e.g., Artificial Intelligence"
              />
            </div>

            {/* Research interests (optional) */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700">Research Interests (optional)</label>
              <textarea
                name="research_interests"
                value={form.research_interests}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md"
                rows={3}
                placeholder="e.g., Machine Learning, NLP, Data Mining"
              />
            </div>

            <div className="md:col-span-2 mt-4 text-center">
              <button
                type="submit"
                disabled={loading}
                className={`bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>

          {/* Show generated credentials, if returned */}
          {creds && (
            <div className="mt-6 p-4 border rounded bg-green-50 text-green-800">
              <div className="font-semibold mb-1">Faculty Created</div>
              <div>Email: <code>{creds.email}</code></div>
              <div>Password: <code>{creds.password}</code></div>
              <div className="text-xs mt-2">Credentials have also been emailed.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
