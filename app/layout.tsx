import type { Metadata, Viewport } from "next";
import { Archivo, Bebas_Neue, Playfair_Display } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ArianaFlix — 11 Luni",
  description: "Un cadou pentru Ariana. Unsprezece luni de dragoste, într-un singur loc.",
};

export const viewport: Viewport = {
  themeColor: "#141414",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      className={`${archivo.variable} ${bebas.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cinema font-sans text-white">{children}</body>
    </html>
  );
}
