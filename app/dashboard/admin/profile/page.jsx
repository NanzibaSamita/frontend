"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AdminSidebar from "@/components/admin-sidebar";

export default function AdminProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    setUser({
      first_name: decoded.first_name || "System",
      last_name: decoded.last_name || "Admin",
      email: decoded.email || "ayeshamashi01@gmail.com",
      role: decoded.role || "Admin",
      department: decoded.department || "Administration",
    });
  }, []);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-2 sm:p-4">
        <div className="w-full max-w-screen-lg mx-auto bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6">
          {/* Profile Header with Avatar */}
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-base sm:text-lg md:text-xl font-semibold mr-2 sm:mr-3">
              {user.first_name[0]}{user.last_name[0]}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                {user.first_name} {user.last_name}
              </h2>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center border-b border-gray-200 py-1 sm:py-2">
              <span className="font-semibold text-gray-600 text-sm sm:text-base">Full Name:</span>
              <span className="text-gray-800 text-sm sm:text-base">{user.first_name} {user.last_name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 py-1 sm:py-2">
              <span className="font-semibold text-gray-600 text-sm sm:text-base">Email Address:</span>
              <span className="text-gray-800 text-sm sm:text-base">{user.email}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 py-1 sm:py-2">
              <span className="font-semibold text-gray-600 text-sm sm:text-base">Role:</span>
              <span className="text-gray-800 text-sm sm:text-base">{user.role}</span>
            </div>
            <div className="flex justify-between items-center py-1 sm:py-2">
              <span className="font-semibold text-gray-600 text-sm sm:text-base">Department:</span>
              <span className="text-gray-800 text-sm sm:text-base">{user.department}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="bg-blue-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base">
              Edit Profile
            </button>
            <button className="bg-green-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base">
              Change Password
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}