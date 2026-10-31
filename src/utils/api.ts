import { Capacitor } from '@capacitor/core';

export const PROD_API_BASE_URL = 'https://ais-dev-kocqdv6eyo4m676x7o5jyl-674682744139.asia-east1.run.app';

/**
 * Returns full API URL for a given path.
 * In native Capacitor container or when VITE_API_BASE_URL is set,
 * prepends the HTTPS backend base URL.
 */
export const getApiUrl = (path: string): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    const base = envUrl.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  // Inside Capacitor native container (Android / iOS)
  if (typeof window !== 'undefined' && Capacitor?.isNativePlatform?.()) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${PROD_API_BASE_URL}${cleanPath}`;
  }

  // Web environment: relative path works with Vite dev proxy and Cloud Run web server
  return path;
};

/**
 * Installs fetch interceptor for native mobile containers (Android APK / iOS)
 * to automatically route relative '/api/' calls to the production backend.
 * In web / iframe preview environments, this is safely skipped to avoid touching read-only window properties.
 */
/**
 * Safe fetch wrapper that validates content-type before parsing JSON.
 */
export const safeFetchJson = async (input: RequestInfo | URL, init?: RequestInit): Promise<any> => {
  const response = await fetch(input, init);
  
  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`API Error: ${response.status} for ${input} - ${errorBody.substring(0, 100)}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const body = await response.text().catch(() => '');
    console.error(`[API] Expected JSON for ${input} but got ${contentType} (Status: ${response.status}): ${body.substring(0, 100)}`);
    throw new Error(`API Error: Expected JSON response for ${input} but received ${contentType} (Status: ${response.status})`);
  }

  return await response.json();
};

export const setupApiInterceptor = () => {
  if (typeof window === 'undefined') return;

  // Only run in native Capacitor environment where window.fetch needs to point to remote server
  // and where window.fetch is a standard writable WebView property
  try {
    // Always allow logging in dev/web environment
    if (!import.meta.env.PROD) {
      // Proceed to set up logging
    } else if (!Capacitor?.isNativePlatform?.()) {
      return;
    }
  } catch {
    return;
  }

  try {
    const originalFetch = window.fetch.bind(window);
    const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : (input instanceof URL ? input.toString() : (input as Request).url);
      const isSearchApi = url.includes('/api/stocks/search');

      if (isSearchApi) {
        console.log(`[Diagnostic] Outgoing Search Request: ${url}`, init);
      }

      const response = await (async () => {
        if (typeof input === 'string' && input.startsWith('/api/')) {
          return originalFetch(getApiUrl(input), init);
        }
        if (input instanceof URL && input.pathname.startsWith('/api/')) {
          return originalFetch(getApiUrl(input.pathname + input.search), init);
        }
        return originalFetch(input, init);
      })();

      if (isSearchApi) {
        const clonedResponse = response.clone();
        clonedResponse.json().then(data => {
          console.log(`[Diagnostic] Incoming Search Response: ${url}`, { status: response.status, data });
        }).catch(err => {
          console.log(`[Diagnostic] Incoming Search Response Parse Error: ${url}`, { status: response.status, err });
        });
      }
      return response;
    };

    try {
      window.fetch = customFetch;
    } catch {
      try {
        Object.defineProperty(window, 'fetch', {
          value: customFetch,
          writable: true,
          configurable: true,
        });
      } catch {
        // Safe fallback in restricted sandboxes
      }
    }
  } catch (err) {
    console.warn('[api] Failed to setup native API interceptor:', err);
  }
};
