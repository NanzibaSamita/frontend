export const metadata = {
  title: "My Next.js App",
  description: "A modern web app built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen bg-gray-50 text-gray-900">
        
        
        <main className="p-6">{children}</main>

        
      </body>
    </html>
  );
}
