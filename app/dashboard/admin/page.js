"use client"

import AdminSidebar from "../../../components/admin-sidebar";  // Correct path to your sidebar component

export default function AdminPage() {
  return (
    <div className="flex">
      {/* <AdminSidebar /> Admin Sidebar for navigation */}
      
      {/* Main Content */}
      <div className="flex-1 p-10">
        {/* Admin Profile section */}
        <h1 className="text-4xl font-bold text-black mb-8">Admin Profile</h1>

        {/* White Card with Profile Information */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <table className="w-full text-sm md:text-base">
            <tbody>
              <tr className="border-b">
                <td className="font-medium py-4 text-gray-700">Full Name:</td>
                <td className="py-4 text-gray-800 text-right">MD. Admin User</td>
              </tr>
              <tr className="border-b">
                <td className="font-medium py-4 text-gray-700">Employee ID:</td>
                <td className="py-4 text-gray-800 text-right">ADM001</td>
              </tr>
              <tr className="border-b">
                <td className="font-medium py-4 text-gray-700">Email Address:</td>
                <td className="py-4 text-gray-800 text-right">admin@pams.com</td>
              </tr>
              <tr className="border-b">
                <td className="font-medium py-4 text-gray-700">Role:</td>
                <td className="py-4 text-gray-800 text-right">Admin</td>
              </tr>
              <tr>
                <td className="font-medium py-4 text-gray-700">Join Date:</td>
                <td className="py-4 text-gray-800 text-right">2023-07-22</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Button to change password */}
        <div className="mt-6 flex justify-center">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
