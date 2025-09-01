"use client";
import { useEffect, useState } from "react";

export default function FacultyProfilePage() {
  const [user, setUser] = useState(null);

  // Fetch faculty profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:8080/api/faculty/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex justify-center p-10 bg-gray-100 min-h-screen">
      <main className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Faculty Profile</h1>

        <div className="bg-white shadow-md rounded-xl border border-gray-200 p-8 space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Full Name:</span>
            <span className="text-gray-900">{user.first_name} {user.last_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="text-gray-900">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Role:</span>
            <span className="text-gray-900">{user.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Max Supervision Capacity:</span>
            <span className="text-gray-900">{user.max_supervision_capacity}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
