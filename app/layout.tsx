import TopBar from "@/components/ui/Topbar";
import "./globals.css";

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

          <AuroraBackground className="">
            {children}
            <TopBar />
          </AuroraBackground>

      </body>
    </html>
  );
}

