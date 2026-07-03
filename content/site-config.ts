// ============================================================
// VARIATION MANIFEST  (kodagen build — do not hand-edit lightly)
// ------------------------------------------------------------
//  brand              : Marlowe & Finch
//  industry           : artisan bakery  (gate: food_retail → CART required)
//  build_mode         : fullsite (multi-page public, NO admin)
//  asset_mode         : prompt-only  (T4 still hero + parallax, no video)
//  archetype          : G   (Mixed-Media Hybrid — LOCKED via intake)
//  style_id           : S-heritage-warm
//  color_variant      : warm-espresso / honey-crust
//  voice_family       : warm-editorial-heritage
//  card_variant       : CV8 (sticker / paper)
//  header_variant     : center-logo-split
//  footer_variant     : FT2 (asymmetric editorial)
//  cart_variant       : C2 (header-anchored mini popover)
//  hero_overlay       : bottom-scrim gradient
//  hero_text_pattern  : stacked serif with italic accent line
//  hero_entrance      : still-image parallax + magnetic CTA
//  services_variant   : sticker-grid
//  cta_variant        : split primary/secondary on solid
//  motion_intensity   : medium
// ============================================================

import assetManifest from "@/content/asset-manifest.json";

const heroImage =
  ((assetManifest as { images?: Record<string, string> }).images ?? {})[
    "section-hero"
  ] ?? "";

export const siteConfig = {
  // -- Commerce identity (cart flow) ------------------------------
  slug: "marlowe-and-finch",
  currency: "USD",
  industry: "food_retail",
  cartVariant: "C2" as const,

  // -- Brand identity ---------------------------------------------
  company: {
    name: "Marlowe & Finch",
    tagline: "Baked slow, the old way",
    description:
      "Marlowe & Finch is a small-batch Brooklyn bakery turning stone-milled grain, wild yeast and patience into sourdough, viennoiserie and celebration cakes — baked fresh before the sun clears the rooftops.",
    email: "hello@marloweandfinch.com",
    phone: "+1 (718) 555-0192",
    location: "Brooklyn, New York",
  },

  brand: {
    primary: "#E0AE57",
    accent: "#C97C54",
    bg: "#17110C",
  },

  typography: {
    display: "Fraunces",
    body: "Inter",
    mono: "JetBrains Mono",
  },

  // -- SEO + meta -------------------------------------------------
  seo: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://marloweandfinch.com",
    locale: "en_US",
    htmlLang: "en",
    defaultTitle: "Marlowe & Finch — Baked slow, the old way",
    defaultDescription:
      "A small-batch Brooklyn bakery: stone-milled sourdough, buttery viennoiserie and custom celebration cakes, baked fresh every morning. Order online for pickup.",
    defaultOgImage:
      ((assetManifest as { images?: Record<string, string> }).images ?? {})[
        "section-og"
      ] ?? "/og-default.png",
    twitterHandle: "@marloweandfinch",
    noindexPaths: ["/account", "/admin", "/auth", "/api", "/checkout", "/order-confirmation"],
    googleSiteVerification: "",
    structuredData: {
      businessType: "Bakery",
      address: {
        streetAddress: "214 Vanderbilt Avenue",
        addressLocality: "Brooklyn",
        addressRegion: "NY",
        postalCode: "11205",
        addressCountry: "US",
      },
      hours: [
        { dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "18:00" },
        { dayOfWeek: ["Saturday", "Sunday"], opens: "08:00", closes: "16:00" },
      ],
      priceRange: "$$",
      geo: { latitude: 40.6894, longitude: -73.9666 },
      rating: null,
      starRating: null,
      amenities: [],
      cuisine: ["Bakery", "Sourdough", "Pastry"],
    },
  },

  socials: {
    instagram: "https://instagram.com/marloweandfinch",
    twitter: "",
    facebook: "https://facebook.com/marloweandfinch",
    linkedin: "",
    youtube: "",
    tiktok: "https://tiktok.com/@marloweandfinch",
    whatsapp: "",
  },

  // -- Hero -------------------------------------------------------
  hero: {
    h1: [
      { text: "Old-world", accent: false },
      { text: "sourdough,", accent: true },
      { text: "baked at dawn.", accent: false },
    ],
  },

  tagline: "Baked slow, the old way",

  // -- Services ---------------------------------------------------
  servicesHeading: "What comes out of the oven",

  services: [
    {
      name: "Sourdough & Artisan Breads",
      slug: "breads",
      description:
        "Naturally leavened loaves built on a 40-year-old starter and a 36-hour cold ferment — blistered crust, open crumb, deep flavour.",
      highlights: [
        "Country boule & seeded batards",
        "Sesame semolina baguettes",
        "Stone-milled whole-grain miches",
        "Weekly rotating specials",
      ],
    },
    {
      name: "Pastries & Viennoiserie",
      slug: "pastries",
      description:
        "Laminated by hand each morning with European butter — croissants, kouign-amann, seasonal danishes and morning buns.",
      highlights: [
        "72-layer butter croissants",
        "Seasonal fruit danishes",
        "Brown-butter morning buns",
        "Almond & pistachio bostock",
      ],
    },
    {
      name: "Custom Celebration Cakes",
      slug: "cakes",
      description:
        "Made-to-order cakes for weddings, birthdays and quiet Tuesdays — real buttercream, seasonal fillings, nothing from a mix.",
      highlights: [
        "Weddings & tiered cakes",
        "Birthday & occasion cakes",
        "Seasonal flavour menu",
        "Two weeks' notice for custom",
      ],
    },
    {
      name: "Online Ordering & Pickup",
      slug: "ordering",
      description:
        "Reserve tomorrow's bake tonight. Order online, skip the line, and collect warm from the Vanderbilt Avenue counter.",
      highlights: [
        "Pre-order next-day bread",
        "Skip-the-line pickup window",
        "Standing weekly orders",
        "Catering & office boxes",
      ],
    },
  ] as Array<{ name: string; slug: string; description: string; highlights?: string[] }>,

  // -- Products (cart flow) --------------------------------------
  products: [
    {
      slug: "country-sourdough",
      name: "Country Sourdough Boule",
      description: "36-hour cold-fermented loaf with a dark, blistered crust and open, custard crumb.",
      price: "$12",
      priceCents: 1200,
      category: "Bread",
      imageSlot: "product-sourdough",
    },
    {
      slug: "sesame-baguette",
      name: "Sesame Semolina Baguette",
      description: "Crackly semolina baguette rolled in toasted sesame — best torn the hour it's baked.",
      price: "$6",
      priceCents: 600,
      category: "Bread",
      imageSlot: "product-baguette",
    },
    {
      slug: "butter-croissant",
      name: "Butter Croissant",
      description: "Seventy-two hand-laminated layers of French butter. Shatteringly crisp, honeycomb inside.",
      price: "$4.50",
      priceCents: 450,
      category: "Pastry",
      imageSlot: "product-croissant",
    },
    {
      slug: "seasonal-danish",
      name: "Seasonal Fruit Danish",
      description: "Vanilla-bean custard and whatever fruit the greenmarket handed us this week.",
      price: "$5",
      priceCents: 500,
      category: "Pastry",
      imageSlot: "product-danish",
    },
    {
      slug: "celebration-cake",
      name: "Six-Inch Celebration Cake",
      description: "A ready-to-collect layer cake with real buttercream — serves six to eight.",
      price: "$58",
      priceCents: 5800,
      category: "Cake",
      imageSlot: "product-cake",
    },
    {
      slug: "brown-butter-cookies",
      name: "Brown-Butter Cookies (½ dozen)",
      description: "Half a dozen brown-butter chocolate cookies with flaky salt, baked to order.",
      price: "$9",
      priceCents: 900,
      category: "Pastry",
      imageSlot: "product-cookies",
    },
  ] as Array<{
    slug: string;
    name: string;
    description: string;
    price: string;
    priceCents: number;
    category: string;
    imageSlot: string;
  }>,

  rooms: [] as Array<never>,
  locations: [] as Array<never>,
  gallery: [] as Array<{ src: string; alt: string; caption?: string }>,

  // -- Why us -----------------------------------------------------
  whyUs: {
    heading: "Why it tastes different",
    items: [
      {
        title: "Wild yeast, no shortcuts",
        description:
          "Every loaf rises on a starter we've kept alive since 1985 — no commercial yeast, no dough conditioners, no rushing the ferment.",
      },
      {
        title: "Stone-milled grain",
        description:
          "We mill heritage wheat in small batches so the flour still carries the germ, the oil and the flavour that industrial milling strips away.",
      },
      {
        title: "Baked this morning",
        description:
          "Nothing sits overnight. The ovens are lit at 3am so what you carry home was flour at midnight and bread by breakfast.",
      },
      {
        title: "A neighbourhood counter",
        description:
          "We're a Brooklyn corner bakery, not a chain — we know our regulars' orders and we'll happily set aside your Saturday loaf.",
      },
    ],
  },

  // -- Process ----------------------------------------------------
  process: [
    { step: 1, title: "Mill & mix", description: "Heritage grain is stone-milled and folded into a wet, slow dough." },
    { step: 2, title: "Ferment", description: "A 36-hour cold ferment builds acidity, aroma and that open crumb." },
    { step: 3, title: "Shape & score", description: "Each loaf is hand-shaped and scored so it opens the way it should." },
    { step: 4, title: "Bake at dawn", description: "Into the stone deck at 3am — steam, then a long, dark bake." },
  ],

  // -- About ------------------------------------------------------
  aboutHeading: "A bakery built on patience",
  aboutStory:
    "Marlowe & Finch began with a jar of sourdough starter on a Brooklyn windowsill and a stubborn belief that bread should take time. What started as weekend loaves for neighbours grew into a corner bakery on Vanderbilt Avenue, where we still mill our own grain, laminate croissants by hand, and light the ovens long before the city wakes. We name every loaf, know our regulars, and refuse to hurry the ferment — because the old way, slow and unhurried, is the only way it tastes like this.",
  manifesto: "Good bread cannot be rushed — and we've stopped trying.",
  values: [
    { title: "Slow by design", description: "Long ferments and honest ingredients, never speed for its own sake." },
    { title: "Grain to crust", description: "We mill, mix, shape and bake under one roof, so we own every step." },
    { title: "Rooted in the block", description: "A neighbourhood bakery that feeds the same faces every morning." },
    { title: "Zero-waste kitchen", description: "Yesterday's bread becomes croutons, crumbs and the staff's lunch." },
  ],

  // -- Work (case studies / gallery) ------------------------------
  work: [] as Array<{ title: string; client: string; service: string; result: string }>,

  // -- Stats ------------------------------------------------------
  stats: [
    { value: "40", label: "Years of living starter" },
    { value: "36", label: "Hour cold ferment" },
    { value: "3", label: "AM the ovens light" },
    { value: "600", label: "Loaves baked daily" },
  ],

  // -- Features (archetype G section 2) ---------------------------
  features: [
    {
      title: "The 36-hour loaf",
      description:
        "Time is our only additive. A day-and-a-half ferment is what gives our sourdough its keeping quality, its aroma and its unmistakable tang.",
    },
    { title: "Milled in-house", description: "Heritage grain, stone-milled weekly for maximum flavour and nutrition." },
    { title: "Hand-laminated daily", description: "Croissant dough folded fresh each dawn — never frozen, never shortcut." },
    { title: "Order-ahead pickup", description: "Reserve tomorrow's bake tonight and skip the Saturday queue." },
  ],

  sectionThemeWord: "Patience",

  narrative: [] as Array<{ speaker: string; text: string }>,

  // -- Mixed-media (archetype G) — prompt-only: no accent video ----
  mixedMedia: {
    skipSecondaryVideo: true,
    accentEyebrow: "From our counter",
    accentLine: "Good bread cannot be rushed — and we've stopped trying.",
  },

  // -- CTA --------------------------------------------------------
  cta: {
    primary: "Order for pickup",
    secondary: "See what we bake",
  },

  ctaBlock: {
    heading: "Reserve tomorrow's bake.",
    description:
      "Order online tonight and collect it warm from the counter in the morning — or come say hello on Vanderbilt Avenue.",
  },

  trustBar: [
    "Est. Brooklyn",
    "Naturally leavened",
    "Stone-milled grain",
    "Baked daily at dawn",
  ],

  // -- Cinematic config -------------------------------------------
  scrollHero: {
    archetype: "G" as "A" | "B" | "C" | "D" | "E" | "F" | "G",
    styleId: "S-heritage-warm",
    assetMode: "prompt-only" as "live-generate" | "prompt-only",
    imageUrl: heroImage,
    scrollDistance: 3,
  },

  // -- Header / footer variants -----------------------------------
  headerVariant: "center-logo-split" as const,
  footerVariant: "FT2" as const,

  // -- Motion -----------------------------------------------------
  motion: {
    scrollProgress: true,
    cursorFollower: false,
    intensity: "medium" as "low" | "medium" | "high",
  },
};

export type SiteConfig = typeof siteConfig;
export default siteConfig;
