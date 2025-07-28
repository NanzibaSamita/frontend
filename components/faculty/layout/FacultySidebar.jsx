"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  FileCheck,
  FileText,
  User,
  ChevronUp,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useState } from "react";

export default function FacultySidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const navigationItems = [
    {
      name: "Course Content",
      href: "/dashboard/faculty/course",
      icon: <BookOpen size={18} />,
    },
    {
      name: "Supervision Requests",
      href: "/dashboard/faculty/supervision",
      icon: <Users size={18} />,
    },
    {
      name: "Thesis Proposal Approvals",
      href: "/dashboard/faculty/thesis-proposals",
      icon: <FileCheck size={18} />,
    },
    {
      name: "Thesis Approvals",
      href: "/dashboard/faculty/thesis-approvals",
      icon: <FileText size={18} />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <aside className="bg-gray-800 text-white min-h-screen w-56 p-4 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <h2 className="text-2xl font-bold mb-8">PAMS</h2>
        <nav className="flex flex-col space-y-2">
          {navigationItems.map(({ name, href, icon }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition ${
                pathname.startsWith(href) ? "bg-gray-700" : ""
              }`}
            >
              {icon}
              <span>{name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div>
        {/* Logout button shown only when toggled */}
        {showLogout && (
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-600 transition bg-red-500 text-white font-semibold"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        )}

        {/* Profile row — always visible */}
        <div className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition">
          <Link
            href="/dashboard/faculty/profile"
            className="flex items-center gap-2 text-white"
          >
            <User size={18} />
            <span>Profile</span>
          </Link>
          <button onClick={() => setShowLogout((prev) => !prev)}>
            {showLogout ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
