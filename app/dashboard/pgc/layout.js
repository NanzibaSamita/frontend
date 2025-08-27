import "./global.css";

export const metadata = {
  title: "PAMS",
  description: "Postgraduate Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
