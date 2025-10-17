import React from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/components/LoaderContext";

export const metadata = {
  title: "WhatsApp Clone",
  description: "Chat app frontend in Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "sans-serif", margin: 0, padding: 0 }}>
       <LoaderProvider>
         <AuthProvider>
          <header>
        <Header />
        </header>
       
        {children}
        <footer>
        <Footer/>
        </footer>
         <Toaster position="top-right" reverseOrder={false} />
         </AuthProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
