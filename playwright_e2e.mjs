import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  console.log('[Playwright E2E] Starting full browser automation verification...');
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  
  const consoleErrors = [];
  const failedRequests = [];

  if (!fs.existsSync('/tmp/byeongdol_verify/logs')) {
    fs.mkdirSync('/tmp/byeongdol_verify/logs', { recursive: true });
  }

  // 1. PC Viewport Test (1280x800)
  const contextPC = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const pagePC = await contextPC.newPage();

  pagePC.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  pagePC.on('requestfailed', req => {
    failedRequests.push(`${req.url()} - ${req.failure()?.errorText}`);
  });

  console.log('[Playwright E2E] Navigating to http://127.0.0.1:8080/ (PC Viewport)...');
  await pagePC.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await pagePC.waitForTimeout(4000);
  
  const pcTitle = await pagePC.title();
  console.log('[Playwright E2E] PC Page Title:', pcTitle);
  await pagePC.screenshot({ path: '/tmp/byeongdol_verify/logs/screenshot_pc.png', fullPage: true });
  console.log('[Playwright E2E] PC screenshot captured.');

  // 2. Tablet Viewport Test (768x1024)
  const contextTablet = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const pageTablet = await contextTablet.newPage();
  await pageTablet.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await pageTablet.waitForTimeout(2000);
  await pageTablet.screenshot({ path: '/tmp/byeongdol_verify/logs/screenshot_tablet.png', fullPage: true });
  console.log('[Playwright E2E] Tablet screenshot captured.');

  // 3. Mobile Viewport Test (390x844 with Touch/Mobile UA)
  const contextMobile = await browser.newContext({ 
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await pageMobile.waitForTimeout(2000);
  
  // Simulate touch scroll & interaction
  await pageMobile.mouse.wheel(0, 400);
  await pageMobile.waitForTimeout(1000);
  await pageMobile.screenshot({ path: '/tmp/byeongdol_verify/logs/screenshot_mobile.png', fullPage: true });
  console.log('[Playwright E2E] Mobile screenshot captured.');

  await browser.close();

  console.log('=== E2E AUTOMATION TEST COMPLETED ===');
  console.log('Console Errors Count:', consoleErrors.length);
  if (consoleErrors.length > 0) console.log('Console Errors:', consoleErrors);
  console.log('Failed Requests Count:', failedRequests.length);
  if (failedRequests.length > 0) console.log('Failed Requests:', failedRequests);
  console.log('=====================================');
})().catch(err => {
  console.error('[Playwright E2E] Fatal error:', err);
  process.exit(1);
});
