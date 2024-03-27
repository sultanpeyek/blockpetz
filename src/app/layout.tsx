import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlockPetz",
  description:
    'This project is a showcase of the Metaplex "Core" capabilities. Here, you can mint, feed, and burn your BlockPetz.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
