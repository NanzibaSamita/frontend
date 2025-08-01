"use client"

import FacultySidebar from "./FacultySidebar"

export default function FacultyLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <FacultySidebar />
      <div className="flex-1 bg-gray-50">{children}</div>
    </div>
  )
}
