import "./globals.css"

export const metadata = {
  title: "PAMS - Postgraduate Academic Management System",
  description: "Postgraduate Academic Management System for efficient academic workflow management",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">{children}</body>
    </html>
  )
}
