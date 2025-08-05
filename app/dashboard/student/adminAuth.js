"use client";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satohi.css";
import "@/css/style.css";

import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import Providers from "@/components/Providers";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { AuthProvider, AdminAuth } from "@/contexts/AuthContext";

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="bg-[#F7F7F7]">
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          
            {loading ? (
              <Loader />
            ) : (
              <AdminAuth>
                <DefaultLayout>{children}</DefaultLayout>
              </AdminAuth>
            )}
          
        </div>
      </body>
    </html>
  );
}