"use client";

export default function StudentProfile() {
  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      <main className="flex-1 pt-12 flex flex-col items-center">
        {/* Container for heading + card + button */}
        <div className="w-full max-w-4xl">
          {/* Heading aligned with card */}
          <h1 className="text-4xl font-bold text-black mb-8">Profile</h1>

          {/* Card */}
          <div className="bg-white border border-gray-300 rounded-md shadow-md p-6">
            <table className="w-full text-sm md:text-base">
              <tbody>
                <tr className="border-b">
                  <td className="font-medium py-3 text-gray-700">Full Name:</td>
                  <td className="py-3 text-gray-800 text-right">
                    Sadika Tabassum
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium py-3 text-gray-700">
                    Student ID:
                  </td>
                  <td className="py-3 text-gray-800 text-right">220042147</td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium py-3 text-gray-700">
                    Email Address:
                  </td>
                  <td className="py-3 text-gray-800 text-right">
                    sadikatabassum@iut-dhaka.edu
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium py-3 text-gray-700">
                    Department:
                  </td>
                  <td className="py-3 text-gray-800 text-right">
                    Computer Science and Engineering
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium py-3 text-gray-700">Program:</td>
                  <td className="py-3 text-gray-800 text-right">MSc in CSE</td>
                </tr>
                <tr>
                  <td className="font-medium py-3 text-gray-700">
                    Current AY:
                  </td>
                  <td className="py-3 text-gray-800 text-right">2025-2026</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Centered button under card */}
          <div className="mt-6 flex justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md shadow transition">
              Change Password
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
