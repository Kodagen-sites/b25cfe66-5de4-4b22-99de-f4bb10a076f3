import { siteConfig } from "@/content/site-config";
import Header from "@/components/headers/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/motion/FilmGrain";
import Vignette from "@/components/motion/Vignette";
import { CartProvider } from "@/components/cart/CartContext";
import { CartFlow } from "@/components/cart/CartFlow";
import EditorBridge from "@/components/__kodagen/EditorBridge";

// Public-site chrome. Route group — URLs are unchanged; /admin and /api
// live outside it and render without the site's header/footer/cart.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider brandSlug={siteConfig.slug} currency={siteConfig.currency}>
      <Header />
      <CartFlow />
      <main>{children}</main>
      <Footer />
      <Vignette />
      <FilmGrain />
      <EditorBridge />
    </CartProvider>
  );
}
