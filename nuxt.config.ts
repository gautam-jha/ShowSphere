const isDev = process.env.NODE_ENV === 'development'
const apiBaseUrl = process.env.NUXT_ENV_API_URL
const streamUrl = process.env.NUXT_ENV_STREAM_BASE
const prodUrl = process.env.NUXT_ENV_PROD_URL

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxt/image-edge',
    '@nuxtjs/i18n',
  ],
  experimental: {
    inlineSSRStyles: false,
    viewTransition: true,
    renderJsonPayloads: true,
  },
  routeRules: {
    '/**': isDev ? {} : { cache: { swr: true, maxAge: 120, staleMaxAge: 60, headersOnly: true } },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl,
      streamUrl,
      prodUrl,
    },
  },
  devtools: {
    enabled: true,
  },
  image: {
    provider: 'proxy',
    providers: {
      proxy: {
        provider: 'ipx',
        options: {
          baseURL: `${apiBaseUrl}/ipx`,
        },
      },
    },
  },
  nitro: {
    preset: 'node-server',
    devProxy: {
      '/api': {
        target: `${apiBaseUrl}/tmdb`,
        changeOrigin: true,
        prependPath: true,
      },
      '/stream': {
        target: `${streamUrl}`,
        changeOrigin: true,
        prependPath: true,
      },
    },

    routeRules: {
      '/api': { proxy: `${apiBaseUrl}/tmdb`, isr: false },
      '/**': { isr: false },
    },
    prerender: {
      crawlLinks: false,
      ignore: ['/movies', '/tv', '/person'],
    },
  },
  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      fallbackLocale: 'en',
    },
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
      {
        code: 'de-DE',
        name: 'Deutsch',
        file: 'de-DE.json',
      },
      {
        code: 'es-ES',
        name: 'Español',
        file: 'es-ES.json',
      },
      {
        code: 'ja',
        name: '日本語',
        file: 'ja.json',
      },
      {
        code: 'zh-CN',
        name: '简体中文',
        file: 'zh-CN.json',
      },
      {
        code: 'pt-PT',
        name: 'Português',
        file: 'pt-PT.json',
      },
      {
        code: 'pt-BR',
        name: 'Português do Brasil',
        file: 'pt-BR.json',
      },
    ],
    lazy: true,
    langDir: 'internationalization',
    defaultLocale: 'en',
  },
})
