import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: "族谱 | Family Tree",
  description: "一个复古风格的族谱应用 | A vintage-styled family tree application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html>
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
