"use client";

import FacultyProfile from "@/components/faculty/profile/FacultyProfile";

export default function FacultyProfilePage() {
  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      <main className="flex-1 pt-12 flex flex-col items-center">
        {/* Info Card Component */}
        <FacultyProfile />
      </main>
    </div>
  );
}
