"use client";
import Link from "next/link";

export default function PgcProfile() {
  const user = {
    first_name: "Ahsan",
    last_name: "Karim",
    email: "ahsan.karim@iut.edu.bd",
    role: "PGC Member",
    department: "CSE Department",
    employeeId: "EMP-1029",
    joined_on: "2023-10-12",
  };

  return (
    // ⬇︎ no max-width, no flex/justify-center — let it span the whole content area
    <div className="w-full text-black">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {/* ⬇︎ full width card (no max-w), add a subtle border */}
      <div className="w-full bg-white shadow rounded-md border border-gray-300">
        <Row
          label="Full Name:"
          value={`${user.first_name} ${user.last_name}`}
          bordered
        />
        <Row label="Employee ID:" value={user.employeeId} bordered />
        <Row label="Email Address:" value={user.email} bordered />
        <Row label="Department:" value={user.department} bordered />
        <Row label="Join Date:" value={user.joined_on} />
      </div>

      {/* left-aligned button to match faculty vibe */}
      <div className="mt-6">
        <Link
          href="/forgot-password"
          className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Change Password
        </Link>
      </div>
    </div>
  );
}

// Make label column fixed width so the value column can stretch nicely
function Row({ label, value, bordered }) {
  return (
    <div
      className={`grid grid-cols-[200px_1fr] items-center px-8 py-5 ${
        bordered ? "border-b" : ""
      }`}
    >
      <div className="text-gray-700 font-semibold">{label}</div>
      <div className="text-right">{value || "-"}</div>
    </div>
  );
}
