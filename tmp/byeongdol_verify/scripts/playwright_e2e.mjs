import { chromium } from 'playwright';

(async () => {
  console.log('[Playwright E2E] Starting browser automation test...');
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  
  const consoleMessages = [];
  const failedRequests = [];

  // 1. PC Viewport Test
  const contextPC = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const pagePC = await contextPC.newPage();

  pagePC.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(`[Console Error] ${msg.text()}`);
    }
  });

  pagePC.on('requestfailed', req => {
    failedRequests.push(`[Request Failed] ${req.url()} - ${req.failure()?.errorText}`);
  });

  console.log('[Playwright E2E] Navigating to http://127.0.0.1:8080/ (PC Viewport)...');
  const response = await pagePC.goto('http://127.0.0.1:8080/', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('[Playwright E2E] Initial page load status:', response?.status());

  // Wait for app root or main stock components
  await pagePC.waitForTimeout(3000);
  const title = await pagePC.title();
  console.log('[Playwright E2E] Page title:', title);

  // Check search / stock items or navigation
  const bodyText = await pagePC.innerText('body');
  console.log('[Playwright E2E] Body text sample (length):', bodyText.length);

  // Take screenshot for evidence
  await pagePC.screenshot({ path: '/tmp/byeongdol_verify/logs/screenshot_pc.png', fullPage: true });
  console.log('[Playwright E2E] PC screenshot saved.');

  // 2. Tablet Viewport Test
  const contextTablet = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const pageTablet = await contextTablet.newPage();
  await pageTablet.goto('http://127.0.0.1:8080/', { waitUntil: 'networkidle' });
  await pageTablet.waitForTimeout(1500);
  await pageTablet.screenshot({ path: '/tmp/byeongdol_verify/logs/screenshot_tablet.png' });
  console.log('[Playwright E2E] Tablet screenshot saved.');

  // 3. Mobile Viewport & Touch/Scroll Test
  const contextMobile = await browser.newContext({ 
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://127.0.0.1:8080/', { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(1500);
  
  // Simulate touch scroll & interaction
  await pageMobile.mouse.wheel(0, 500);
  await pageMobile.waitForTimeout(1000);
  await pageMobile.screenshot({ path: '/tmp/byeongdol_verify/logs/screenshot_mobile.png' });
  console.log('[Playwright E2E] Mobile screenshot saved.');

  await browser.close();

  console.log('=== PLAYWRIGHT E2E TEST SUMMARY ===');
  console.log('Console Errors:', consoleMessages.length > 0 ? consoleMessages : 'None');
  console.log('Failed Requests:', failedRequests.length > 0 ? failedRequests : 'None');
  console.log('===================================');
})().catch(err => {
  console.error('[Playwright E2E] Fatal error:', err);
  process.exit(1);
});
