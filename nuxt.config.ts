// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    ssr: false,
    css: ['@/assets/css/main.scss'],
    modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-icon', '@nuxt/image', 'nuxt-headlessui', '@morev/vue-transitions/nuxt',],
    runtimeConfig: {
        public: {
            appUrl: process.env.APP_URL ?? 'http://dashboard.wsa.test:4664',
            apiUrl: process.env.API_URL ?? 'http://api.wsa.test:8805',
        },
    },
    build: {
        transpile: ['@vuepic/vue-datepicker'],
    },
    imports: {
        dirs: ['./stores'],
    },
    nitro: {
        routeRules: {
            '/backend/**': {
                proxy: `${process.env.API_URL ?? 'http://api.wsa.test:8805'}/**`,
            }
        },
        compressPublicAssets: true,
    },
    app: {
        buildAssetsDir: '/wsa-dashboard/',
        rootId: '__wsadashboard',
        head: {
            title: 'WSA Dashboard',
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            htmlAttrs: {
                lang: 'en',
                dir: 'ltr',
            },
        },
        pageTransition: {name: 'page', mode: 'out-in'},
    },
    headlessui: {
        prefix: 'Headless',
    },
    postcss: {
        plugins: {
            'postcss-import': {},
            'postcss-advanced-variables': {},
            'tailwindcss/nesting': {},
            tailwindcss: {},
            autoprefixer: {},
        },
    },
})