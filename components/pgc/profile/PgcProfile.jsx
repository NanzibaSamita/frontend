"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PgcProfile() {
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

        const res = await fetch("http://localhost:8080/api/pgc/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload.message || "Failed to load profile");
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

  const fullName = `${profile.first_name} ${profile.last_name}`;
  const joined = new Date(profile.joined_on).toLocaleDateString();

  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      <main className="flex-1 pt-12 flex flex-col items-center">
        {/* wider container + side padding on small screens */}
        <div className="w-full max-w-6xl px-4">
          <h1 className="text-4xl font-bold text-black mb-8">Profile</h1>

          {/* roomier card padding */}
          <div className="bg-white border border-gray-300 rounded-md shadow-md p-6 sm:p-8 md:p-10 lg:p-12">
            <table className="w-full text-sm md:text-base">
              <tbody>
                <tr className="border-b">
                  <td className="font-medium py-4 px-4 text-gray-700">
                    Full Name:
                  </td>
                  <td className="py-4 px-4 text-gray-800 text-right">
                    {fullName}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium py-4 px-4 text-gray-700">
                    Email Address:
                  </td>
                  <td className="py-4 px-4 text-gray-800 text-right">
                    {profile.email}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium py-4 px-4 text-gray-700">
                    Department:
                  </td>
                  <td className="py-4 px-4 text-gray-800 text-right">
                    {profile.department}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium py-4 px-4 text-gray-700">Role:</td>
                  <td className="py-4 px-4 text-gray-800 text-right">
                    {profile.role}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium py-4 px-4 text-gray-700">
                    Joined On:
                  </td>
                  <td className="py-4 px-4 text-gray-800 text-right">
                    {joined}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* centered button */}
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
