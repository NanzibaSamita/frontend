"use client";

import FacultySidebar from "./FacultySidebar";

export default function FacultyLayout({ children }) {
  return (
    <div className="flex max-h-screen">
      <FacultySidebar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">{children}</div>
    </div>
  );
}
