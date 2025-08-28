"use client";
import PgcSidebar from "./PgcSidebar";

export default function PgcLayout({ children }) {
  return (
    <div className="flex text-black min-h-screen">
      <PgcSidebar />

      <section className="p-6 bg-white">{children}</section>
    </div>
  );
}
