'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * /admin/content — Content Hub
 * 
 * Entry point for content management. Cards link to each editable area.
 * Each card shows last-updated time + primary action button.
 * 
 * Replaces the legacy content-view.tsx pattern. Uses new site_* tables from
 * 0008_site_content.sql migration.
 */

type ContentArea = {
  href: string;
  title: string;
  description: string;
  icon: string;
  lastUpdated?: string;
};

export default function ContentHubPage() {
  const [areas, setAreas] = useState<ContentArea[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/admin/content/summary')
      .then(r => r.json())
      .then(data => {
        setAreas([
          {
            href: '/admin/content/settings',
            title: 'Site Settings',
            description: 'Business name, contact details, currency, locale, default SEO.',
            icon: '⚙',
            lastUpdated: data.settings?.updated_at,
          },
          {
            href: '/admin/content/pages',
            title: 'Pages',
            description: 'Edit page titles, descriptions, custom heroes, publish status.',
            icon: '📄',
            lastUpdated: data.pages?.latest_update,
          },
          {
            href: '/admin/content/locations',
            title: 'Locations',
            description: 'Addresses, coordinates, per-location contact details.',
            icon: '📍',
            lastUpdated: data.locations?.latest_update,
          },
          {
            href: '/admin/content/hours',
            title: 'Hours of Operation',
            description: 'Opening hours per location per day. Holiday closures.',
            icon: '🕒',
            lastUpdated: data.hours?.latest_update,
          },
          {
            href: '/admin/content/social',
            title: 'Social Links',
            description: 'Instagram, Facebook, WhatsApp, and other social URLs.',
            icon: '🔗',
            lastUpdated: data.social?.latest_update,
          },
          {
            href: '/admin/media',
            title: 'Media Library',
            description: 'Upload and organize photos and videos for your site.',
            icon: '🖼',
            lastUpdated: data.media?.latest_update,
          },
          {
            href: '/admin/content/copy',
            title: 'Voice & Copy',
            description: "Edit hero text, brand story, and other voice-sensitive copy with AI help.",
            icon: '✎',
            lastUpdated: data.copy_overrides?.latest_update,
          },
          {
            href: '/admin/journal',
            title: 'Journal',
            description: 'Write and publish blog posts. Published posts appear on the public journal page and in the sitemap.',
            icon: '📝',
          },
          {
            href: '/admin/testimonials',
            title: 'Testimonials',
            description: 'Manage customer reviews shown on your site.',
            icon: '💬',
          },
        ]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-display mb-3">Content</h1>
        <p className="text-lg text-neutral-600 max-w-2xl">
          Edit your site's text, images, and settings here. Most changes are forms.
          For voice-sensitive copy like your hero headline, use the AI editor.
        </p>
      </div>
      
      {loading ? (
        <div className="text-neutral-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map(area => (
            <Link
              key={area.href}
              href={area.href}
              className="group block p-6 bg-white border border-neutral-200 rounded-xl hover:border-neutral-400 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{area.icon}</div>
                {area.lastUpdated && (
                  <div className="text-xs text-neutral-400">
                    Updated {formatRelativeTime(area.lastUpdated)}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-display mb-2 group-hover:text-brand-accent transition">
                {area.title}
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {area.description}
              </p>
              <div className="mt-4 text-sm font-medium text-brand-accent">
                Edit →
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-16 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
        <h3 className="font-display text-lg mb-2">Need to change something we don't see here?</h3>
        <p className="text-sm text-neutral-600 mb-3">
          For structural changes — adding a new section, changing the layout, restyling — 
          use the AI editor in the main dashboard. It can regenerate parts of your site while keeping
          your voice and brand consistent.
        </p>
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-brand-accent hover:underline"
        >
          Open AI editor →
        </Link>
      </div>
    </div>
  );
}

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}
