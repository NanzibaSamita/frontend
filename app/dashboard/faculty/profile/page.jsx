"use client";

import FacultyProfile from "@/components/faculty/profile/FacultyProfile";

export default function FacultyProfilePage() {
  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      <main className="flex-1 pt-12 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          {/* Left-aligned heading */}
          <h1 className="text-4xl font-bold text-black mb-8">Profile</h1>

          {/* Info Card Component */}
          <FacultyProfile />
        </div>
      </main>
    </div>
  );
}
