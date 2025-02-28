import TopBar from "@/components/ui/Topbar";
import "./globals.css";
 
import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/background";

  

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
    <html lang="en" suppressHydrationWarning>
      <body>
        
      <TopBar />
        {children}
      </body>
    </html>
  );
}

