// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/eslint-module"],
  eslint: {
    /* module options */
  }
})