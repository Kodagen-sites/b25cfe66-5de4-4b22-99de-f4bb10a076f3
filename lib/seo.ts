import type { Metadata } from 'next';
import { cache } from 'react';
import { createServiceClient } from '@/lib/supabase/server';
import { FK_COL, DB_MODE, getScopeId } from '@/lib/db-scope';
import { siteConfig } from '@/lib/site-config';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';
const SLUG     = process.env.NEXT_PUBLIC_SITE_SLUG ?? '';

type SiteDefaults = {
  businessName:    string;
  metaTitle:       string;
  metaDescription: string;
  ogImage:         string;
};

function fallbackDefaults(): SiteDefaults {
  const name = siteConfig.company?.name ?? 'Business';
  return {
    businessName:    name,
    metaTitle:       siteConfig.seo?.defaultTitle ?? name,
    metaDescription: siteConfig.seo?.defaultDescription ?? '',
    ogImage:         siteConfig.seo?.defaultOgImage ?? '/og.jpg',
  };
}

export const getSiteDefaults = cache(async function (): Promise<SiteDefaults> {
  try {
    const supabase = createServiceClient();
    const scopeId  = await getScopeId(supabase);

    if (!scopeId) return fallbackDefaults();

    // In shared mode get the site name from the sites directory first,
    // since site_settings may not exist for older sites.
    let businessNameFallback = siteConfig.company?.name ?? 'Business';
    if (DB_MODE === 'shared') {
      const { data: site } = await supabase
        .from('sites')
        .select('name')
        .eq('slug', SLUG)
        .maybeSingle();
      if (site?.name) businessNameFallback = site.name as string;
    }

    const { data: settings } = await supabase
      .from('site_settings')
      .select('business_name, default_meta_title, default_meta_description, default_og_image_url')
      .eq(FK_COL, scopeId)
      .maybeSingle();

    const name = (settings?.business_name as string) || businessNameFallback;

    return {
      businessName:    name,
      metaTitle:       (settings?.default_meta_title       as string) || siteConfig.seo?.defaultTitle       || name,
      metaDescription: (settings?.default_meta_description as string) || siteConfig.seo?.defaultDescription || '',
      ogImage:         (settings?.default_og_image_url     as string) || siteConfig.seo?.defaultOgImage     || '/og.jpg',
    };
  } catch {
    return fallbackDefaults();
  }
});

export async function buildMeta({
  title,
  description,
  image,
  path = '/',
  noIndex = false,
}: {
  title?:       string;
  description?: string;
  image?:       string;
  path?:        string;
  noIndex?:     boolean;
}): Promise<Metadata> {
  const defaults = await getSiteDefaults();

  const resolvedTitle       = title       || defaults.metaTitle;
  const resolvedDescription = description || defaults.metaDescription;
  const resolvedImage       = image       || defaults.ogImage;
  const canonicalUrl        = `${SITE_URL}${path}`;

  return {
    title:       resolvedTitle,
    description: resolvedDescription,
    openGraph: {
      title:       resolvedTitle,
      description: resolvedDescription,
      url:         canonicalUrl,
      images:      [{ url: resolvedImage }],
      type:        'website',
    },
    twitter: {
      card:        'summary_large_image',
      title:       resolvedTitle,
      description: resolvedDescription,
      images:      [resolvedImage],
    },
    robots:     noIndex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
  };
}

export { SITE_URL, SLUG };
