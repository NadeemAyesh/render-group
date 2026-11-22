import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
});

export const metadata: Metadata = {
  title: "Render Connect & Render Studio | منصة العمل الحر واستوديو أدوات الذكاء الاصطناعي",
  description: "المنظومة الرقمية الموحدة لتمكين الكفاءات الفلسطينية برعاية Render Group: سوق العمل الحر، صانع السير الذاتية بالذكاء الاصطناعي (ATS)، وأدوات الإبداع الرقمي الـ 12 الموحدة.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-64.png", type: "image/png", sizes: "64x64" },
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexArabic.variable} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        {/* Anti-FOUC Theme Initializer: Defaults to Light Mode unless explicitly set to dark */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('renderlancer_theme') || 'light';
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased selection:bg-gold-500 selection:text-dark-950 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
