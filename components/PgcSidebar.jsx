"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileCheck2,
  Users,
  Gauge,
  Settings,
  LogOut,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

export default function PgcSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  // Main navigation links for PGC
  const links = [
    {
      name: "Supervisor Requests",
      href: "/dashboard/pgc", // list page
      icon: <FileCheck2 size={18} />,
    },
    {
      name: "Faculty Load",
      href: "/dashboard/pgc/faculty-load",
      icon: <Gauge size={18} />,
    },
    {
      name: "Faculty Directory",
      href: "/dashboard/pgc/faculty",
      icon: <Users size={18} />,
    },
    {
      name: "Settings",
      href: "/dashboard/pgc/settings",
      icon: <Settings size={18} />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <aside className="bg-gray-800 text-white min-h-screen w-56 p-4 flex flex-col justify-between">
      {/* Top Section: Main Links */}
      <div>
        <h2 className="text-2xl font-bold mb-8">PAMS PGC</h2>
        <nav className="flex flex-col space-y-6">
          {links.map(({ name, href, icon }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-gray-700"
                  : ""
              }`}
            >
              {icon}
              <span>{name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Section: Profile + Logout Dropdown */}
      <div>
        {showLogout && (
          <button
            onClick={handleLogout}
            className="mb-2 w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-600 transition bg-red-500 text-white font-semibold"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        )}

        <div className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition">
          <Link
            href="/dashboard/pgc/profile"
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
