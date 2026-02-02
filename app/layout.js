import { Inter } from "next/font/google";
import "./globals.css";
import Wrapper from "@/wrapper/Wrapper";
import ReduxWrapper from "@/wrapper/ReduxWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "NEXTCYBR | An AI Powered Cyber Security Skills Learning Platform",
  description:
    "NEXTCYBR - The World's ⚡ Leading Platform for Cyber Professionals | An AI Powered Cyber Security Skills Learning Platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ReduxWrapper>
          <Wrapper>{children}</Wrapper>
        </ReduxWrapper>
      </body>
    </html>
  );
}
