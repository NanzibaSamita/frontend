export default function StudentProfile() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="bg-white border rounded-md overflow-hidden">
        <div className="grid grid-cols-2 border-b p-4">
          <strong>Full Name:</strong> <span>Sadika Tabassum</span>
        </div>
        <div className="grid grid-cols-2 border-b p-4">
          <strong>Student ID:</strong> <span>220042147</span>
        </div>
        <div className="grid grid-cols-2 border-b p-4">
          <strong>Email Address:</strong> <span>sadikatabassum@iut-dhaka.edu</span>
        </div>
        <div className="grid grid-cols-2 border-b p-4">
          <strong>Department:</strong> <span>Computer Science and Engineering</span>
        </div>
        <div className="grid grid-cols-2 border-b p-4">
          <strong>Program:</strong> <span>MSc in CSE</span>
        </div>
        <div className="grid grid-cols-2 p-4">
          <strong>Current AY:</strong> <span>2025–2026</span>
        </div>
      </div>

      <button className="mt-6 bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700">
        Change Password
      </button>
    </div>
  )
}
