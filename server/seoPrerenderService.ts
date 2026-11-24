/**
 * SEO & HTML Prerender Service for AdSense Public Pages
 * 
 * Strict Guidelines:
 * 1. NO hidden text (display:none, aria-hidden, or cloaking tricks strictly prohibited).
 * 2. Injects real, visible semantic HTML content accessible to both search bots and human visitors.
 * 3. Dynamically updates <head> tags: Title, Description, Canonical, Open Graph, Twitter Cards, Schema.org JSON-LD.
 * 4. Ensures zero hydration/mount crash with React SPA.
 * 5. Supports dynamic host resolution for IP-based dev and future custom domain.
 */

import fs from 'fs';
import path from 'path';
import express from 'express';
import { editorialContentService } from './editorialContentService';

let indexHtmlTemplate: string | null = null;

function getIndexHtmlTemplate(isProduction: boolean): string {
  if (indexHtmlTemplate && isProduction) {
    return indexHtmlTemplate;
  }
  const filePath = isProduction
    ? path.join(process.cwd(), 'dist', 'index.html')
    : path.join(process.cwd(), 'index.html');

  if (fs.existsSync(filePath)) {
    indexHtmlTemplate = fs.readFileSync(filePath, 'utf8');
    return indexHtmlTemplate;
  }
  return '<!doctype html><html><head><title>병돌 인베스트먼트</title></head><body><div id="root"></div></body></html>';
}

export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, any>;
  bodyHtml?: string;
}

export const STATIC_PAGE_SEO: Record<string, { title: string; description: string; heading: string; summary: string }> = {
  '/about': {
    title: '회사 및 서비스 소개 - 병돌 인베스트먼트',
    description: '실시간 금융 시세 데이터와 건전한 투자 커뮤니티 문화를 지향하는 병돌 인베스트먼트(Byeongdol Investment)의 서비스 철학과 기술을 소개합니다.',
    heading: '병돌 인베스트먼트 (Byeongdol Investment) 서비스 소개',
    summary: '병돌 인베스트먼트는 개인 투자자들이 시장의 비대칭 정보에서 벗어나 데이터 기반의 합리적인 의사결정을 내릴 수 있도록 돕는 실시간 금융 데이터 및 커뮤니티 플랫폼입니다.',
  },
  '/privacy': {
    title: '개인정보처리방침 - 병돌 인베스트먼트',
    description: '이용자의 소중한 개인정보 보호를 위한 수집 항목, 목적, 보유 기간 및 이용자의 권리에 관한 안내입니다.',
    heading: '병돌 인베스트먼트 개인정보처리방침',
    summary: '병돌 인베스트먼트는 정보통신망 이용촉진 및 정보보호 등에 관한 법률 및 개인정보보호법에 따라 이용자의 개인정보를 철저히 보호하고 있습니다.',
  },
  '/terms': {
    title: '서비스 이용약관 - 병돌 인베스트먼트',
    description: '병돌 인베스트먼트 웹 및 모바일 서비스 이용에 관한 회원과 회사의 권리, 의무 및 책임 사항 규정입니다.',
    heading: '병돌 인베스트먼트 서비스 이용약관',
    summary: '본 약관은 회사가 제공하는 실시간 시세, 커뮤니티, 포트폴리오 관리 등 제반 서비스 이용과 관련하여 회사와 이용자 간의 기본 권리 및 의무를 규정합니다.',
  },
  '/disclaimer': {
    title: '투자 유의사항 및 면책 고지 - 병돌 인베스트먼트',
    description: '병돌 인베스트먼트에서 제공하는 모든 시황 및 분석 자료는 정보 제공 목적이며, 투자 판단의 최종 책임은 투자자 본인에게 있습니다.',
    heading: '투자 유의사항 및 법적 면책 고지 (Disclaimer)',
    summary: '본 서비스가 제공하는 모든 금융 데이터, AI 시황 분석, 커뮤니티 의견은 참고용 정보이며, 특정 증권의 매수 또는 매도를 권유하는 금융투자 자문이 아닙니다.',
  },
  '/contact': {
    title: '고객 지원 및 제휴 문의 - 병돌 인베스트먼트',
    description: '서비스 이용 불편 사항 문의, 시스템 버그 제보, 금융 데이터 제휴 창구 안내입니다.',
    heading: '고객 지원 및 비즈니스 제휴 문의',
    summary: '병돌 인베스트먼트는 사용자 여러분의 소중한 피드백과 다양한 파트너십 제휴 제안을 언제나 환영합니다.',
  },
};

export const seoPrerenderService = {
  /**
   * Resolve public base URL dynamically:
   * 1. Strictly prioritizes APP_BASE_URL environment variable if set.
   * 2. Validates incoming Host against trusted host patterns (localhost, *.run.app, *.aistudio.google, *.byeongdol.kr, ALLOWED_HOSTS).
   * 3. Sanitizes protocol (strictly https or http).
   * 4. Rejects untrusted or spoofed hosts to prevent Host Header Injection attacks.
   */
  resolveBaseUrl(req: express.Request): string {
    // 1. Top Priority: APP_BASE_URL env var
    if (process.env.APP_BASE_URL) {
      return process.env.APP_BASE_URL.trim().replace(/\/$/, '');
    }

    const isProd = process.env.NODE_ENV === 'production' || !!process.env.K_SERVICE;

    // 2. Explicit whitelist of allowed hosts (No wildcards)
    const explicitTrustedHosts = new Set<string>([
      'ais-dev-kocqdv6eyo4m676x7o5jyl-674682744139.asia-east1.run.app',
      'ais-pre-kocqdv6eyo4m676x7o5jyl-674682744139.asia-east1.run.app',
      'byeongdol.kr',
      'www.byeongdol.kr',
    ]);

    // Include dynamically configured host from APP_URL if present
    if (process.env.APP_URL) {
      try {
        const u = new URL(process.env.APP_URL);
        if (u.hostname) explicitTrustedHosts.add(u.hostname.toLowerCase());
      } catch {}
    }
    if (process.env.CUSTOM_DOMAIN) {
      explicitTrustedHosts.add(process.env.CUSTOM_DOMAIN.trim().toLowerCase());
    }
    if (process.env.ALLOWED_HOSTS) {
      process.env.ALLOWED_HOSTS.split(',').forEach(h => {
        const cleaned = h.trim().toLowerCase();
        if (cleaned) explicitTrustedHosts.add(cleaned);
      });
    }

    // Localhost / 127.0.0.1 is strictly allowed ONLY in non-production local development
    if (!isProd) {
      explicitTrustedHosts.add('localhost');
      explicitTrustedHosts.add('127.0.0.1');
    }

    // Validate incoming Host against explicit whitelist
    const hostHeader = (req.headers['x-forwarded-host'] as string) || req.get('host') || '';
    const rawHost = hostHeader.split(',')[0].trim();

    const isTrustedHost = (h: string): boolean => {
      if (!h) return false;
      // Disallow control characters, newlines, spaces, or slashes
      if (/[\s\r\n\/\\]/.test(h)) return false;

      // Extract hostname without port
      const hostname = h.split(':')[0].toLowerCase();
      return explicitTrustedHosts.has(hostname);
    };

    let safeHost: string;
    if (isTrustedHost(rawHost)) {
      safeHost = rawHost;
    } else {
      // In production environment, NEVER expose localhost
      if (isProd) {
        if (process.env.APP_URL) {
          try {
            return process.env.APP_URL.trim().replace(/\/$/, '');
          } catch {}
        }
        return 'https://byeongdol.kr';
      } else {
        safeHost = 'localhost:3000';
      }
    }

    // Determine protocol (strictly 'https' or 'http')
    const protoHeader = (req.headers['x-forwarded-proto'] as string || '').toLowerCase().trim();
    const isHttps = req.secure || protoHeader === 'https' || isProd;
    const proto = isHttps ? 'https' : 'http';

    return `${proto}://${safeHost}`;
  },

  /**
   * Render complete HTML with replaced <head> tags and visible initial body markup
   */
  renderHtml(req: express.Request, meta: SeoMetadata, isProduction: boolean): string {
    const template = getIndexHtmlTemplate(isProduction);

    let html = template;

    // 1. Replace Title
    html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);

    // 2. Replace or inject Meta Description
    if (html.includes('<meta name="description"')) {
      html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${escapeHtml(meta.description)}" />`);
    } else {
      html = html.replace('</head>', `  <meta name="description" content="${escapeHtml(meta.description)}" />\n</head>`);
    }

    // 3. Inject Canonical URL
    const canonicalTag = `<link rel="canonical" href="${escapeHtml(meta.canonicalUrl)}" />`;
    if (html.includes('<link rel="canonical"')) {
      html = html.replace(/<link rel="canonical".*?\/>/i, canonicalTag);
    } else {
      html = html.replace('</head>', `  ${canonicalTag}\n</head>`);
    }

    // 4. Update Open Graph Tags
    const ogTags = `
  <meta property="og:title" content="${escapeHtml(meta.title)}" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  <meta property="og:url" content="${escapeHtml(meta.canonicalUrl)}" />
  <meta property="og:type" content="${escapeHtml(meta.ogType || 'website')}" />
  <meta property="og:site_name" content="병돌 인베스트먼트" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
  <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
`.trim();

    html = html.replace('</head>', `  ${ogTags}\n</head>`);

    // 5. Inject Structured JSON-LD if present
    if (meta.jsonLd) {
      const jsonLdScript = `\n  <script type="application/ld+json">\n${JSON.stringify(meta.jsonLd, null, 2)}\n  </script>\n`;
      html = html.replace('</head>', `${jsonLdScript}</head>`);
    }

    // 6. Inject Visible Initial HTML into <div id="root">
    // (Search engines see this exact text immediately without executing JS; React re-hydrates seamlessly)
    if (meta.bodyHtml) {
      html = html.replace('<div id="root"></div>', `<div id="root">${meta.bodyHtml}</div>`);
    }

    return html;
  },

  /**
   * Express Middleware Handler for AdSense Public Pages
   */
  async handlePrerender(req: express.Request, res: express.Response, isProduction: boolean): Promise<boolean> {
    const rawPath = req.path.toLowerCase().replace(/\/$/, '') || '/';
    const baseUrl = this.resolveBaseUrl(req);

    // 1. Static Policy Pages (/about, /privacy, /terms, /disclaimer, /contact)
    if (STATIC_PAGE_SEO[rawPath]) {
      const page = STATIC_PAGE_SEO[rawPath];
      const canonicalUrl = `${baseUrl}${rawPath}`;

      const bodyHtml = `
<main class="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 max-w-4xl mx-auto">
  <article class="prose prose-invert max-w-none">
    <header class="border-b border-slate-700 pb-4 mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-white">${escapeHtml(page.heading)}</h1>
      <p class="text-slate-400 mt-2 text-sm">${escapeHtml(page.summary)}</p>
    </header>
    <div class="text-slate-300 leading-relaxed space-y-4">
      <p>병돌 인베스트먼트는 정확한 증시 데이터와 건전한 투자 생태계를 위한 정직한 서비스를 제공합니다.</p>
      <p>상세 약관 및 최신 업데이트 내용은 웹 및 앱 클라이언트 화면에서 실시간으로 확인하실 수 있습니다.</p>
    </div>
  </article>
</main>
`.trim();

      const meta: SeoMetadata = {
        title: page.title,
        description: page.description,
        canonicalUrl,
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: page.title,
          description: page.description,
          url: canonicalUrl,
          publisher: {
            '@type': 'Organization',
            name: '병돌 인베스트먼트',
            url: baseUrl,
          },
        },
        bodyHtml,
      };

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=600');
      res.send(this.renderHtml(req, meta, isProduction));
      return true;
    }

    // 2. Insights Categories & Listing (/insights, /insights/domestic-market, /insights/us-market, /insights/economy)
    if (rawPath === '/insights' || rawPath.startsWith('/insights/')) {
      const parts = rawPath.split('/').filter(Boolean);
      // parts[0] === 'insights'
      const sub = parts[1]; // category or insight id

      const validCategories: Record<string, string> = {
        'domestic-market': '국내 증시 분석',
        'us-market': '미국 증시 분석',
        'economy': '글로벌 거시경제 분석',
      };

      // Case 2-A: Category Listing
      if (!sub || validCategories[sub]) {
        const catLabel = validCategories[sub] || '전체 금융 시장 분석';
        const pageTitle = `${catLabel} 리포트 및 투자 인사이트 - 병돌 인베스트먼트`;
        const pageDesc = `코스피, 코스닥, 뉴욕증시, 환율 및 거시경제 지표를 아우르는 전문 리서치와 정밀 시장 분석 리포트를 제공합니다.`;
        const canonicalUrl = `${baseUrl}${rawPath}`;

        let publishedList: any[] = [];
        try {
          publishedList = await editorialContentService.getPublicPublishedInsights(sub as any, 10);
        } catch {}

        const articlesListHtml = publishedList.length > 0
          ? publishedList.map(a => `
<li class="border-b border-slate-800 py-4">
  <a href="/insights/${escapeHtml(a.id)}" class="text-rose-400 hover:text-rose-300 font-bold text-lg block mb-1">
    ${escapeHtml(a.title)}
  </a>
  <p class="text-slate-400 text-sm mb-2 line-clamp-2">${escapeHtml(a.summary)}</p>
  <div class="text-xs text-slate-500 font-mono">
    <span>${escapeHtml(a.categoryLabel || a.category)}</span> • <span>${new Date(a.createdAt).toLocaleDateString('ko-KR')}</span>
  </div>
</li>`).join('')
          : '<p class="text-slate-400 py-6">현재 등록된 분석 리포트를 준비 중입니다.</p>';

        const bodyHtml = `
<main class="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 max-w-4xl mx-auto">
  <header class="border-b border-slate-700 pb-4 mb-6">
    <h1 class="text-2xl md:text-3xl font-bold text-white">${escapeHtml(catLabel)}</h1>
    <p class="text-slate-400 mt-2 text-sm">${escapeHtml(pageDesc)}</p>
  </header>
  <section>
    <ul class="divide-y divide-slate-800">
      ${articlesListHtml}
    </ul>
  </section>
</main>
`.trim();

        const meta: SeoMetadata = {
          title: pageTitle,
          description: pageDesc,
          canonicalUrl,
          ogType: 'website',
          bodyHtml,
        };

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=300');
        res.send(this.renderHtml(req, meta, isProduction));
        return true;
      }

      // Case 2-B: Single Insight Article (/insights/:id)
      const insight = await editorialContentService.getPublicInsightById(sub);
      if (insight) {
        const canonicalUrl = `${baseUrl}/insights/${insight.id}`;
        const pageTitle = `${insight.title} - 병돌 인베스트먼트`;
        const pageDesc = insight.summary || insight.title;

        // Simple markdown to clean HTML conversion
        const contentHtml = insight.content
          .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-6 mb-2">$1</h3>')
          .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-8 mb-3 pb-2 border-b border-slate-800">$1</h2>')
          .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black text-white mt-8 mb-4">$1</h1>')
          .replace(/^\> (.*$)/gim, '<blockquote class="p-3 bg-slate-800 border-l-4 border-rose-500 text-slate-300 my-4 text-sm">$1</blockquote>')
          .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
          .replace(/\n\n/gim, '</p><p class="my-3 text-slate-300 leading-relaxed">');

        const bodyHtml = `
<main class="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 max-w-4xl mx-auto">
  <article class="prose prose-invert max-w-none">
    <header class="border-b border-slate-700 pb-4 mb-6">
      <div class="flex items-center gap-2 text-xs font-mono text-rose-400 mb-2 font-bold">
        <span>${escapeHtml(insight.categoryLabel || insight.category)}</span>
        <span>•</span>
        <span>발행일: ${new Date(insight.publishedAt || insight.createdAt).toLocaleDateString('ko-KR')}</span>
      </div>
      <h1 class="text-2xl md:text-3xl font-extrabold text-white leading-tight">${escapeHtml(insight.title)}</h1>
      <p class="text-slate-400 mt-3 text-base leading-relaxed bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">${escapeHtml(insight.summary)}</p>
    </header>
    <div class="article-content text-slate-200 text-base leading-relaxed">
      <p class="my-3 text-slate-300 leading-relaxed">${contentHtml}</p>
    </div>
  </article>
</main>
`.trim();

        const meta: SeoMetadata = {
          title: pageTitle,
          description: pageDesc,
          canonicalUrl,
          ogType: 'article',
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: insight.title,
            description: insight.summary,
            datePublished: insight.publishedAt || insight.createdAt,
            dateModified: insight.updatedAt,
            author: {
              '@type': 'Organization',
              name: insight.authorName || '병돌 리서치팀',
            },
            publisher: {
              '@type': 'Organization',
              name: '병돌 인베스트먼트',
              url: baseUrl,
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl,
            },
          },
          bodyHtml,
        };

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=600');
        res.send(this.renderHtml(req, meta, isProduction));
        return true;
      }
    }

    return false; // Not an AdSense prerender target, continue to next middleware
  },
};
