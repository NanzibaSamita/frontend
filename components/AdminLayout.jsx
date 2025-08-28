// components/AdminLayout.jsx
"use client";

import AdminAuth from "@/app/AdminAuth";
import AdminSidebar from "./admin-sidebar";

export default function AdminLayout({ children }) {
  return (
    <AdminAuth>
      <div className="flex max-h-screen">
        <AdminSidebar />
        <main className="flex-1 bg-[#f8faf9] p-6 overflow-auto">
          {children}
        </main>
      </div>
    </AdminAuth>
  );
}
