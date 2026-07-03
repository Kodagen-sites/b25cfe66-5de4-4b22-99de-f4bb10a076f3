import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { siteConfig } from "@/content/site-config";
import Header from "@/components/headers/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/motion/FilmGrain";
import Vignette from "@/components/motion/Vignette";
import { CartProvider } from "@/components/cart/CartContext";
import { CartFlow } from "@/components/cart/CartFlow";
import EditorBridge from "@/components/__kodagen/EditorBridge";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.seo.siteUrl),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: `%s — ${siteConfig.company.name}`,
  },
  description: siteConfig.seo.defaultDescription,
  applicationName: siteConfig.company.name,
  keywords: [
    "Brooklyn bakery",
    "artisan sourdough",
    "viennoiserie",
    "custom celebration cakes",
    "order bread online",
  ],
  openGraph: {
    type: "website",
    siteName: siteConfig.company.name,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    url: siteConfig.seo.siteUrl,
    locale: siteConfig.seo.locale,
    images: [{ url: siteConfig.seo.defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    site: siteConfig.seo.twitterHandle,
    images: [siteConfig.seo.defaultOgImage],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={siteConfig.seo.htmlLang}
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="bg-bg text-cream font-body antialiased overflow-x-hidden">
        <CartProvider brandSlug={siteConfig.slug} currency={siteConfig.currency}>
          <Header />
          <CartFlow />
          <main>{children}</main>
          <Footer />
        </CartProvider>
        <Vignette />
        <FilmGrain />
        <EditorBridge />
      </body>
    </html>
  );
}
