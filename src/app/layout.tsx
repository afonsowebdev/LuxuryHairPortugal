import type { Metadata } from "next";
import { Playfair_Display, Inter, Alex_Brush } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const script = Alex_Brush({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "Luxury Hair Portugal | Perucas, Box Braids & Pestanas",
    template: "%s | Luxury Hair Portugal",
  },
  description:
    "Luxury Hair Portugal — perucas de cabelo 100% humano, box braids e pestanas premium. Saúde, amor e cabelos arrumados todos os dias. Envio para Portugal e Moçambique.",
  keywords: [
    "perucas cabelo humano",
    "box braids",
    "pestanas",
    "luxury hair portugal",
    "perucas portugal",
  ],
  openGraph: {
    title: "Luxury Hair Portugal",
    description:
      "Perucas de cabelo 100% humano, box braids e pestanas premium. Você é tão incrível quanto se permite ser.",
    siteName: "Luxury Hair Portugal",
    locale: "pt_PT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-PT"
      className={`${serif.variable} ${sans.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-plum-dark">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
