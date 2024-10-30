import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "./GoogleAnalytics";  
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer";
import { AuthContextProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "MovieTime",
  description: "MovieTime is a new generation of content finding applications.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      
      <body>
        <AuthContextProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthContextProvider>
        <Analytics />
        <GoogleAnalytics />
      </body>

      
    </html>
  );
}