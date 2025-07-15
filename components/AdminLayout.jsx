// components/Layout.jsx
"use client"

import AdminSidebar from "./admin-sidebar"
export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar - visible on all dashboard pages */}
      <AdminSidebar />

      {/* Main content area */}
      <main className="flex-1 bg-[#f8faf9] p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
