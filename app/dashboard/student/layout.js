// app/dashboard/student/layout.jsx
import "./globals.css"               // Global styles
import Layout from "@/components/Layout"

export default function StudentLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
