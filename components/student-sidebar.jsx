"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, FileText, Users, BookText, LogOut } from "lucide-react";

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { name: "Profile", href: "/dashboard/student/profile", icon: <Users size={18} /> },
    { name: "Courses", href: "/dashboard/student/course", icon: <BookText size={18} /> },
    { name: "Thesis", href: "/dashboard/student/thesis", icon: <FileText size={18} /> },
    { name: "Supervisor", href: "/dashboard/student/supervisor", icon: <GraduationCap size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");   // Remove token from localStorage
    router.push("/");                   // Redirect to login/home
  };

  return (
    <aside className="bg-gray-800 text-white min-h-screen w-56 p-4 flex flex-col justify-between">
      {/* Top Links */}
      <div>
        <h2 className="text-2xl font-bold mb-8">PAMS</h2>
        <nav className="flex flex-col space-y-2">
          {links.map(({ name, href, icon }) => (
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

      {/* Bottom Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-600 transition bg-red-500 text-white font-semibold"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
