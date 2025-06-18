"use client"

export default function StudentProfile() {
  return (
    <div className="flex min-h-screen">
      
      {/* Main Content */}
      <main className="flex-1 bg-[#f8faf9] p-6">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Full Name:</span>
              <span className="text-gray-600">Sadika Tabassum</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Student ID:</span>
              <span className="text-gray-600">220042147</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Email Address:</span>
              <span className="text-gray-600">sadikatabassum@iut-dhaka.edu</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Department:</span>
              <span className="text-gray-600">Computer Science and Engineering</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Program:</span>
              <span className="text-gray-600">MSc in CSE</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Current AY:</span>
              <span className="text-gray-600">2025-2026</span>
            </div>
          </div>

          <button className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md">
            Change Password
          </button>
        </div>
      </main>
    </div>
  )
}
