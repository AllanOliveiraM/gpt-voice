const runtimeCaching = require('./runtime-caching.config')

const withPWA = require('next-pwa')({
  dest: 'public',
  disable:
    process.env.NODE_ENV === 'development'
      ? !(process.env.USE_DEVELOPMENT_SERVICE_WORKER_DEBUG_MODE === 'true')
      : false,
  runtimeCaching,
  reloadOnOnline: true,
  maximumFileSizeToCacheInBytes: 31457280, // 30 MB
})

const plugins = [withPWA]

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
]

const AVAILABLE_LOCALES = ['pt-BR']
const DEFAULT_LOCALE = 'pt-BR'

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['ts', 'tsx'],
  compiler: {
    styledComponents: {
      ssr: true,
      topLevelImportPaths: [
        '@xstyled/styled-components',
        '@xstyled/styled-components/no-tags',
        '@xstyled/styled-components/native',
        '@xstyled/styled-components/primitives',
      ],
    },
    ...(process.env.NODE_ENV !== 'production'
      ? {}
      : {
          removeConsole: {
            exclude: ['error', 'warn', 'info'],
          },
        }),
  },
  images: {
    domains: [],
  },
  i18n: {
    locales: AVAILABLE_LOCALES,
    defaultLocale: DEFAULT_LOCALE,
  },
  publicRuntimeConfig: {
    locales: AVAILABLE_LOCALES,
    defaultLocale: DEFAULT_LOCALE,
  },
}

module.exports = plugins.reduce((acc, plugin) => plugin(acc), nextConfig)
