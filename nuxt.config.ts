// https://nuxt.com/docs/api/configuration/nuxt-config

const ASSET_BASE_URL = 'https://assets.zhenhuang.tw/legal-citation/web-viewer-favicon'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-28',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/fonts'],
  css: ['@picocss/pico/css/pico.fluid.classless.pumpkin.min.css', '~/assets/css/main.css'],
  typescript: {
    strict: true,
  },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-Hant-TW' },
      meta: [
        {
          name: 'description',
          content: '臺灣 TSSCI 一級法學期刊共同制定的引註格式查詢（非官方）。',
        },
      ],
      title: 'TSSCI Q1 法學引註格式檢索',
      link: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: `${ASSET_BASE_URL}/apple-touch-icon.png`,
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: `${ASSET_BASE_URL}/favicon-32x32.png`,
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: `${ASSET_BASE_URL}/favicon-16x16.png`,
        },
        {
          rel: 'manifest',
          href: `${ASSET_BASE_URL}/site.webmanifest`,
        },
      ],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/robots.txt', '/citations'],
    },
  },

  fonts: {
    // 強制優先使用 bunny 提供商
    provider: 'bunny',

    families: [
      {
        name: 'Gentium Book Basic',
        provider: 'bunny',
        // 明確指定您會用到的粗體與斜體組合
        weights: [400, 700],
        styles: ['normal', 'italic'],
      },
    ],
  },
})
