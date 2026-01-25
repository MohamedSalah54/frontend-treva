"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./globals.css";
import theme from "../theme";
import ReactQueryProvider from "@/src/providers/ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";
import { useLoadUser } from "@/src/hooks/auth/useLoadUser";
import AppLoader from "../ui/AppLoader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/login";
  const { loading } = useLoadUser();

  return (
    <html lang="ar" dir="rtl">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />

            <ReactQueryProvider>
              {loading ? (
                <div className="flex items-center justify-center h-screen">
                  <AppLoader text="Loading ..." />
                </div>
              ) : (
                <>
                  {!hideNavbar && <Navbar />}
                  {children}
                </>
              )}
            </ReactQueryProvider>

            <Toaster position="top-right" />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
