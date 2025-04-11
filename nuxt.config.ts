// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY
  },

  compatibilityDate: '2025-04-11'
})