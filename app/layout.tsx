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
        className={`bg-black text-white`}
      >
      <TopBar />
        {children}
      </body>
    </html>
  );
}
