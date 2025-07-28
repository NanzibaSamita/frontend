// app/dashboard/student/layout.jsx
import AdminAuth from "@/app/AdminAuth"
import "./globals.css"               // Global styles
import Layout from "@/components/Layout"

export default function StudentLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AdminAuth>

        <Layout>{children}</Layout>
        </AdminAuth>
      </body>
    </html>
  )
}
