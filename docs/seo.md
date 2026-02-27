# SEO & GEO

Technical SEO, structured data, and GEO (Generative Engine Optimization) setup for Pickly.

## Overview

Pickly is a Ukrainian-language site (`lang="uk"`). SEO focuses on the landing page and 3 legal pages — the `/app` section is private (auth-required) and blocked from crawlers. Private pages still have proper titles/descriptions for browser tab UX.

**Public pages** (indexed): `/`, `/legal/privacy-policy`, `/legal/terms`, `/legal/contact`
**Private pages** (noindex): `/app/*`, `/auth/*`, `/system/*`

## Metadata Architecture

### Root Layout (`src/app/layout.tsx`)

The root layout sets global defaults inherited by all pages:

- `lang="uk"` on the `<html>` tag
- `metadataBase: new URL('https://pickly.com.ua')` — allows relative URLs in metadata
- Title template: `{ default: '...', template: '%s | Pickly' }` — child pages only set the page-specific part
- Expanded `keywords` array (Ukrainian + English search terms)
- OG and Twitter images pointing to `/images/logo_square.png` (1024x1024 static PNG)
- Canonical URL via `alternates.canonical`
- Authors, creator, icons

### Page Metadata Pattern

**Public pages** set `title` (uses template), `description`, `keywords`, `openGraph`, `twitter`, `alternates.canonical`, and `robots: { index: true, follow: true }`.

**Private pages** set `title` (for browser tab), and `robots: { index: false, follow: false }`. Dynamic pages use `generateMetadata()`.

**Auth pages** inherit noindex from `src/app/auth/layout.tsx` which sets `robots: { index: false, follow: false }` for all auth routes.

## robots.txt

**File**: `src/app/robots.ts`
**URL**: `/robots.txt`

Blocks crawlers from private routes:

```
User-agent: *
Allow: /
Disallow: /app/
Disallow: /auth/
Disallow: /system/
Disallow: /api/
Disallow: /monitoring
Sitemap: https://pickly.com.ua/sitemap.xml
```

## Sitemap

**File**: `src/app/sitemap.ts`
**URL**: `/sitemap.xml`

4 public URLs with priorities:

| URL | Priority | Change Frequency |
|---|---|---|
| `/` | 1.0 | weekly |
| `/legal/privacy-policy` | 0.3 | yearly |
| `/legal/terms` | 0.3 | yearly |
| `/legal/contact` | 0.3 | yearly |

## Structured Data (JSON-LD)

**Component**: `src/components/seo/JsonLd.tsx` — renders `<script type="application/ld+json">`
**Schemas**: `src/lib/seo/schemas.ts` — 4 Schema.org definitions
**Usage**: All 4 schemas injected on the landing page (`src/app/page.tsx`)

### Schemas

| Schema | Type | Purpose |
|---|---|---|
| `getOrganizationSchema()` | Organization | Company name, logo, contact, social links |
| `getSoftwareApplicationSchema()` | SoftwareApplication | App details, free pricing, feature list |
| `getFAQSchema()` | FAQPage | Mirrors 6 Q&A pairs from landing FAQ section |
| `getWebSiteSchema()` | WebSite | Site name, URL, language, publisher |

FAQ data in schemas is kept in sync with `src/components/landing/FAQ.tsx`. When updating FAQ content, update both locations.

## OG / Social Image

**File**: `public/images/logo_square.png` (1024x1024 static PNG)

Used as the image for all OpenGraph and Twitter meta tags. Referenced by root layout in both `openGraph.images` and `twitter.images`. Twitter card type is `summary` (square-friendly) rather than `summary_large_image`.

Also used as the `logo` in the Organization JSON-LD schema and `image` in the SoftwareApplication schema.

## PWA Manifest

**File**: `src/app/manifest.ts`
**URL**: `/manifest.webmanifest`

Standard web app manifest with:
- `name`, `short_name`, `description` in Ukrainian
- `lang: 'uk'`
- `display: 'standalone'`
- Icon references (`/icon.png`, `/apple-icon.png`)
- Theme color matching the OG image dark scheme

## GEO — llms.txt

**File**: `src/app/llms.txt/route.ts`
**URL**: `/llms.txt`

Plain text route handler for AI crawlers (ChatGPT, Perplexity, etc.):
- What is Pickly, how it works, key benefits
- FAQ summary
- Contact info and legal page links
- Uses `sharedConfig` constants to avoid hardcoding
- `Cache-Control: public, max-age=86400` (24h)

## Shared Config

SEO-related constants in `src/config/shared.ts`:
- `SITE_URL: 'https://pickly.com.ua'`
- `SITE_DESCRIPTION` — used in schemas, manifest, llms.txt

## File Reference

| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root metadata (title template, metadataBase, OG, etc.) |
| `src/app/robots.ts` | robots.txt generation |
| `src/app/sitemap.ts` | XML sitemap |
| `public/images/logo_square.png` | Static OG / social image (1024x1024) |
| `src/app/manifest.ts` | PWA manifest |
| `src/app/llms.txt/route.ts` | GEO for AI crawlers |
| `src/app/auth/layout.tsx` | Auth pages noindex layout |
| `src/components/seo/JsonLd.tsx` | Reusable JSON-LD script component |
| `src/lib/seo/schemas.ts` | Schema.org definitions |
| `src/config/shared.ts` | SITE_URL, SITE_DESCRIPTION constants |

## Adding SEO to a New Page

1. **Public page**: Export `metadata` with `title`, `description`, `openGraph`, `twitter`, `alternates.canonical`, `robots: { index: true }`. Add URL to `src/app/sitemap.ts`.
2. **Private page**: Export `metadata` with `title` (for browser tab) and `robots: { index: false, follow: false }`.
3. **Dynamic page**: Export `generateMetadata()` function, include `robots: { index: false, follow: false }` for private pages.

## Updating FAQ Structured Data

The FAQ schema in `src/lib/seo/schemas.ts` must match the FAQ component in `src/components/landing/FAQ.tsx`. When adding/removing/editing FAQ items, update both files.
