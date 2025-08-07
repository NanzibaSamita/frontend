"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AdminSidebar from "@/components/admin-sidebar";

export default function AdminProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Get token
    const token = localStorage.getItem("token");
    if (!token) return;

    // 2. Decode it
    const decoded = jwtDecode(token);
    console.log(decoded)
    // 3. Simulate fetching user info from token (or optional API call)
    // NOTE: This assumes your token includes `email`, `role`, etc.
    setUser({
      first_name: decoded.first_name, // Assuming field exists
      last_name: decoded.last_name,

      employeeId: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
      department: decoded.department,
    });
  }, []);
  console.log(user);
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex h-screen ">
      

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        <div className="bg-white shadow-md rounded-md w-full max-w-4xl">
          <div className="border-b px-10 py-6">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Full Name:</span>
              <span>
                {user.first_name} {user.last_name}{" "}
              </span>
            </div>
          </div>

          {/* <div className="border-b px-10 py-6">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Employee ID:</span>
              <span>{user.employeeId}</span>
            </div>
          </div> */}

          <div className="border-b px-10 py-6">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Email Address:</span>
              <span>{user.email}</span>
            </div>
          </div>

          <div className="border-b px-10 py-6">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Role:</span>
              <span>{user.role}</span>
            </div>
          </div>

          <div className="px-10 py-6">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Join Date:</span>
              <span>{user.department}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-4 px-10">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Edit Profile
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Change Password
          </button>
        </div>
      </main>
    </div>
  );
}