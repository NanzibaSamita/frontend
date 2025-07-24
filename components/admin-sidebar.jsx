"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, FileText, Database, LogOut } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { name: "Profile", href: "/dashboard/admin", icon: <Users size={18} /> },
    { name: "Add Student", href: "/dashboard/admin/student", icon: <Database size={18} /> },
    { name: "Add Faculty", href: "/dashboard/admin/faculty", icon: <Database size={18} /> },
    { name: "Add PGC Member", href: "/dashboard/admin/pgc", icon: <Database size={18} /> },
    { name: "View Students", href: "/dashboard/admin/student/list", icon: <FileText size={18} /> },
    { name: "View Faculties", href: "/dashboard/admin/faculty/list", icon: <FileText size={18} /> },
    { name: "View PGC", href: "/dashboard/admin/pgc/list", icon: <FileText size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");  // Remove token
    router.push("/");                  // Redirect to login/home
  };

  return (
    <aside className="bg-gray-800 text-white min-h-screen w-56 p-4 flex flex-col justify-between">
      {/* Top: Nav links */}
      <div>
        <h2 className="text-2xl font-bold mb-8">PAMS Admin</h2>
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

      {/* Bottom: Logout button */}
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
