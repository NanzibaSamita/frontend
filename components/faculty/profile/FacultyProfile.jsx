// "use client";

// import { useState } from "react";

// export default function FacultyProfile({ facultyData }) {
//   const [showChangePassword, setShowChangePassword] = useState(false);
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPasswords, setShowPasswords] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const defaultData = {
//     fullName: "Aashnan Rahman",
//     employeeId: "FAC002",
//     email: "aashnanrahman@iut-dhaka.edu",
//     department: "Computer Science and Engineering",
//     designation: "Junior Lecturer",
//     joinDate: "2023-07-22",
//   };

//   const data = facultyData || defaultData;

//   const handlePasswordChange = async (e) => {
//     e.preventDefault();

//     if (newPassword !== confirmPassword) {
//       alert("New passwords do not match!");
//       return;
//     }

//     if (newPassword.length < 6) {
//       alert("Password must be at least 6 characters long!");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/auth/change-password",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             currentPassword,
//             newPassword,
//           }),
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         alert(result.message || "Password changed successfully!");
//         setShowChangePassword(false);
//         setCurrentPassword("");
//         setNewPassword("");
//         setConfirmPassword("");
//       } else {
//         alert(result.message || "Failed to change password!");
//       }
//     } catch (error) {
//       alert("An error occurred, please try again!");
//       console.error("Error changing password:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Profile Info Card */}
//       <div className="bg-white rounded-md border border-gray-300 shadow-md w-full">
//         <div className="divide-y divide-gray-200">
//           {[
//             { label: "Full Name", value: data.fullName },
//             { label: "Employee ID", value: data.employeeId },
//             { label: "Email Address", value: data.email },
//             { label: "Department", value: data.department },
//             { label: "Designation", value: data.designation },
//             { label: "Join Date", value: data.joinDate },
//           ].map((item) => (
//             <div
//               key={item.label}
//               className="flex justify-between items-center px-8 py-4"
//             >
//               <span className="text-gray-700">{item.label}:</span>
//               <span className="text-gray-900 font-medium">{item.value}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Change Password Button */}
//       <div className="flex justify-center mt-6">
//         <button
//           onClick={() => setShowChangePassword(true)}
//           className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md shadow transition"
//         >
//           Change Password
//         </button>
//       </div>

//       {/* Modal */}
//       {showChangePassword && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
//             <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
//               Change Password
//             </h2>

//             <form onSubmit={handlePasswordChange} className="space-y-4">
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">
//                   Current Password
//                 </label>
//                 <input
//                   type={showPasswords ? "text" : "password"}
//                   value={currentPassword}
//                   onChange={(e) => setCurrentPassword(e.target.value)}
//                   className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">
//                   New Password
//                 </label>
//                 <input
//                   type={showPasswords ? "text" : "password"}
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">
//                   Confirm New Password
//                 </label>
//                 <input
//                   type={showPasswords ? "text" : "password"}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
//                   required
//                 />
//               </div>

//               <label className="flex items-center space-x-2 text-sm text-gray-700">
//                 <input
//                   type="checkbox"
//                   checked={showPasswords}
//                   onChange={() => setShowPasswords(!showPasswords)}
//                   className="accent-green-600"
//                 />
//                 <span>Show Passwords</span>
//               </label>

//               <div className="flex space-x-4 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowChangePassword(false);
//                     setCurrentPassword("");
//                     setNewPassword("");
//                     setConfirmPassword("");
//                   }}
//                   className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md font-semibold transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition-colors disabled:opacity-50"
//                 >
//                   {isLoading ? "Changing..." : "Change Password"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
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
    console.log(decoded);
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
    <div className="flex text-black h-screen ">
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
