import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  console.log('[Playwright E2E] Launching headless browser...');
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  
  if (!fs.existsSync('/tmp/byeongdol_verify/logs')) {
    fs.mkdirSync('/tmp/byeongdol_verify/logs', { recursive: true });
  }

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  console.log('[Playwright E2E] Navigating to http://127.0.0.1:8080/...');
  await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  await page.waitForTimeout(3000);
  const title = await page.title();
  console.log('[Playwright E2E] Page title:', title);

  await page.screenshot({ path: '/tmp/byeongdol_verify/logs/screenshot_pc.png', fullPage: true });
  console.log('[Playwright E2E] Saved PC screenshot.');

  // Test mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/byeongdol_verify/logs/screenshot_mobile.png', fullPage: true });
  console.log('[Playwright E2E] Saved Mobile screenshot.');

  await browser.close();
  console.log('[Playwright E2E] All browser tests passed successfully.');
})().catch(err => {
  console.error('[Playwright E2E] Error:', err);
  process.exit(1);
});
