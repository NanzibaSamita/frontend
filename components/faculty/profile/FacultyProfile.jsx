"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FacultyProfile() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not authenticated. Please login.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:8080/api/faculty/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(
            (await res.json()).message || "Failed to load profile"
          );
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen bg-[#f8faf9] items-center justify-center">
        <span className="text-lg text-gray-700">Loading profile...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen bg-[#f8faf9] items-center justify-center">
        <div className="bg-white border border-red-300 rounded-md shadow-md p-8">
          <div className="text-red-600 font-semibold text-lg mb-2">Error</div>
          <div>{error}</div>
        </div>
      </div>
    );

  // ✅ Same look & layout as Student Profile
  const fullName =
    profile.fullName ||
    [profile.first_name, profile.last_name].filter(Boolean).join(" ");

  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      <main className="flex-1 pt-12 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold text-black mb-8">Profile</h1>

          <div className="bg-white border border-gray-300 rounded-md shadow-md p-6">
            <table className="w-full text-sm md:text-base">
              <tbody>
                <tr className="border-b">
                  <td className="font-medium py-3 text-gray-700">Full Name:</td>
                  <td className="py-3 text-gray-800 text-right">{fullName}</td>
                </tr>

                <tr className="border-b">
                  <td className="font-medium py-3 text-gray-700">
                    Email Address:
                  </td>
                  <td className="py-3 text-gray-800 text-right">
                    {profile.email}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="font-medium py-3 text-gray-700">Role:</td>
                  <td className="py-3 text-gray-800 text-right">
                    {profile.role || "Faculty"}
                  </td>
                </tr>

                <tr>
                  <td className="font-medium py-3 text-gray-700">
                    Max Supervision Capacity:
                  </td>
                  <td className="py-3 text-gray-800 text-right">
                    {profile.max_supervision_capacity ?? "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Centered button under card */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push("/forgot-password")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md shadow transition"
            >
              Change Password
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
