/**
 * Asset Loader & Safe Fallback Utility
 * Detects missing or corrupted static assets (icons, avatars, uploaded images)
 * and safely substitutes them with responsive, dark-mode-compatible SVG placeholders.
 */

import React from 'react';

// ---------------------------------------------------------------------------
// 1. High-Fidelity Inline SVG Placeholders (Zero external network dependencies)
// ---------------------------------------------------------------------------

/**
 * Standard User Avatar Placeholder (User profile icon with neutral slate styling)
 */
export const DEFAULT_AVATAR_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" fill="none"><rect width="128" height="128" rx="64" fill="%231e293b"/><circle cx="64" cy="48" r="24" fill="%2364748b"/><path d="M24 112c0-22 18-36 40-36s40 14 40 36" fill="%2364748b"/></svg>`;

/**
 * Chat & Community Uploaded Image Placeholder (Visual thumbnail card)
 */
export const DEFAULT_IMAGE_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200" fill="none"><rect width="320" height="200" rx="12" fill="%230f172a" stroke="%23334155" stroke-width="1.5"/><rect x="110" y="60" width="100" height="60" rx="8" fill="%231e293b" stroke="%23475569" stroke-width="1"/><path d="M130 95l15-15 20 20 15-10 15 15H125z" fill="%2364748b"/><circle cx="140" cy="75" r="5" fill="%2394a3b8"/><text x="160" y="145" fill="%2394a3b8" font-size="11" font-weight="500" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif">이미지를 불러올 수 없습니다</text></svg>`;

/**
 * Stock / Corporate Emblem Placeholder
 */
export const DEFAULT_STOCK_LOGO_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="1"/><path d="M20 44l8-16 8 8 10-14" stroke="%2338bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="46" cy="22" r="3" fill="%2338bdf8"/></svg>`;

/**
 * App Icon / Generic Asset Placeholder
 */
export const DEFAULT_ASSET_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none"><rect width="96" height="96" rx="20" fill="%231e293b" stroke="%23334155" stroke-width="1.5"/><path d="M48 30v24m0 12h.01" stroke="%2394a3b8" stroke-width="3.5" stroke-linecap="round"/><text x="48" y="80" fill="%2364748b" font-size="9" text-anchor="middle" font-family="sans-serif">ASSET</text></svg>`;

export type AssetFallbackType = 'avatar' | 'image' | 'stock' | 'icon';

// ---------------------------------------------------------------------------
// 2. Memory Cache for Checked Assets (Avoids redundant HEAD/GET fetches)
// ---------------------------------------------------------------------------
const assetAvailabilityCache = new Map<string, boolean>();

/**
 * Resolves the appropriate fallback data URI based on requested type.
 */
export function getFallbackPlaceholder(type: AssetFallbackType = 'image'): string {
  switch (type) {
    case 'avatar':
      return DEFAULT_AVATAR_PLACEHOLDER;
    case 'stock':
      return DEFAULT_STOCK_LOGO_PLACEHOLDER;
    case 'icon':
      return DEFAULT_ASSET_PLACEHOLDER;
    case 'image':
    default:
      return DEFAULT_IMAGE_PLACEHOLDER;
  }
}

/**
 * Checks if a given URL is empty, malformed, or references a known dead route.
 */
export function isValidAssetUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return false;
  // If it's a relative path without leading slash or schema
  if (!trimmed.startsWith('/') && !trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:') && !trimmed.startsWith('blob:')) {
    return false;
  }
  return true;
}

/**
 * Synchronously returns a safe asset URL or its fallback placeholder.
 */
export function getSafeAssetUrl(
  url: string | null | undefined,
  fallbackType: AssetFallbackType = 'image'
): string {
  if (!isValidAssetUrl(url)) {
    return getFallbackPlaceholder(fallbackType);
  }
  return url!.trim();
}

/**
 * React onError handler for <img> elements: replaces broken src with fallback placeholder.
 * Prevents recursive error loops by checking dataset flag.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackType: AssetFallbackType = 'image'
): void {
  const img = event.currentTarget;
  if (!img) return;

  // Prevent infinite loops if fallback itself ever failed
  if (img.dataset.fallbackApplied === 'true') {
    img.style.display = 'none';
    return;
  }

  img.dataset.fallbackApplied = 'true';
  img.src = getFallbackPlaceholder(fallbackType);
}

/**
 * Asynchronously verifies if a remote or local asset is accessible.
 */
export async function checkAssetExists(url: string): Promise<boolean> {
  if (!isValidAssetUrl(url)) return false;
  if (url.startsWith('data:') || url.startsWith('blob:')) return true;

  if (assetAvailabilityCache.has(url)) {
    return assetAvailabilityCache.get(url)!;
  }

  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => {
      assetAvailabilityCache.set(url, true);
      resolve(true);
    };
    img.onerror = () => {
      assetAvailabilityCache.set(url, false);
      resolve(false);
    };
    img.src = url;
  });
}

/**
 * Preloads a list of critical assets in the background.
 */
export async function preloadAssets(urls: string[]): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};
  await Promise.all(
    urls.map(async (url) => {
      results[url] = await checkAssetExists(url);
    })
  );
  return results;
}
