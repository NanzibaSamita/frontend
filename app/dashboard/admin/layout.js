// app/dashboard/student/layout.jsx
import "./global.css"; // Global styles
import AdminLayout from "@/components/AdminLayout";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function AdminPageLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminLayout>
          <div className="">{children}</div>
        </AdminLayout>
      </body>
    </html>
  );
}
