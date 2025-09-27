declare module 'next-pwa' {
  import { NextConfig } from 'next';

  interface WorkboxConfig {
    swDest?: string;
    swSrc?: string;
    additionalManifestEntries?: Array<{
      url: string;
      revision: string | null;
    }>;
    dontCacheBustURLsMatching?: RegExp;
    exclude?: Array<string | RegExp>;
    excludeChunks?: string[];
    ignoreURLParametersMatching?: RegExp[];
    importScripts?: string[];
    include?: Array<string | RegExp>;
    manifestTransforms?: any[];
    maximumFileSizeToCacheInBytes?: number;
    modifyURLPrefix?: {
      [key: string]: string;
    };
    navigateFallback?: string;
    navigateFallbackAllowlist?: RegExp[];
    navigateFallbackDenylist?: RegExp[];
    cleanupOutdatedCaches?: boolean;
    clientsClaim?: boolean;
    skipWaiting?: boolean;
    sourcemap?: boolean;
    runtimeCaching?: Array<{
      urlPattern: RegExp | string | ((params: { url: URL; request: Request }) => boolean);
      handler: 'CacheFirst' | 'CacheOnly' | 'NetworkFirst' | 'NetworkOnly' | 'StaleWhileRevalidate';
      options?: {
        cacheName?: string;
        expiration?: {
          maxEntries?: number;
          maxAgeSeconds?: number;
        };
        cacheableResponse?: {
          statuses?: number[];
          headers?: {
            [key: string]: string;
          };
        };
        networkTimeoutSeconds?: number;
        backgroundSync?: {
          name?: string;
          options?: {
            maxRetentionTime?: number;
          };
        };
        broadcastUpdate?: {
          channelName?: string;
          options?: {
            headersToCheck?: string[];
          };
        };
        fetchOptions?: RequestInit;
        matchOptions?: CacheQueryOptions;
        plugins?: any[];
      };
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
    }>;
  }

  interface PWAConfig extends WorkboxConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    reloadOnOnline?: boolean;
    scope?: string;
    sw?: string;
    publicExcludes?: string[];
    buildExcludes?: string[];
    fallbacks?: {
      document?: string;
      image?: string;
      audio?: string;
      video?: string;
      font?: string;
    };
    cacheOnFrontEndNav?: boolean;
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string;
    customWorkerDir?: string;
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;

  export = withPWA;
}
