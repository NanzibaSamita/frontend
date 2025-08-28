"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Users,
  FileCheck,
  FileText,
  User,
  ChevronUp,
  ChevronDown,
  LogOut,
} from "lucide-react";

export default function PgcSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const nav = [
    {
      name: "Supervision Requests",
      href: "/dashboard/pgc/supervision-request",
      icon: <Users size={18} />,
    },
    {
      name: "Thesis Proposal Approvals",
      href: "/dashboard/pgc/thesis-proposal-approvals",
      icon: <FileCheck size={18} />,
    },
    {
      name: "Thesis Approvals",
      href: "/dashboard/pgc/thesis-approvals",
      icon: <FileText size={18} />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <aside className="bg-gray-800 text-white min-h-screen w-56 p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-8">PAMS</h2>
        <nav className="flex flex-col space-y-2">
          {nav.map(({ name, href, icon }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition ${
                pathname.startsWith(href) ? "bg-gray-700" : ""
              }`}
            >
              {icon}
              <span className="text-sm">{name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div>
        {showLogout && (
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-600 transition bg-red-500 text-white font-semibold"
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
            <span className="text-sm">Profile</span>
          </Link>
          <button onClick={() => setShowLogout((prev) => !prev)}>
            {showLogout ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
