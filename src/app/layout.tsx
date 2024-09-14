import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import ReactQueryProviders from "@/providers/ReactQueryProviders";
import { ThemeProviders } from "@/providers/ThemeProviders";
import { NavBar } from "@/components/NavBar/NavBart";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FotCamp Tech Blog",
  description: "FotCamp Tech Blog",
  openGraph: {
    title: "FotCamp Tech Blog",
    description: "FotCamp의 기술 블로그입니다.",
    url: "https://blog.fin-hub.co.kr",
    siteName: "FotCamp Tech Blog",
    images: [
      {
        url: "https://blog.fin-hub.co.kr/default_cover_image.png",
        width: 1200,
        height: 630,
        alt: "FotCamp Tech Blog Default Image"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "FotCamp Tech Blog",
    description: "FotCamp의 기술 블로그입니다.",
    images: ["https://blog.fin-hub.co.kr/default_cover_image.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ReactQueryProviders>
          <ThemeProviders
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Theme>
              <NavBar />
              {children}
            </Theme>
          </ThemeProviders>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
