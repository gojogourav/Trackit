import TopBar from "@/components/ui/Topbar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={``}
      >
      <TopBar />
        {children}
      </body>
    </html>
  );
}
