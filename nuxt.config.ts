// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: false,
    devtools: { enabled: true },
    typescript: {
        tsConfig: {
            compilerOptions: {
                moduleResolution: 'bundler',
            },
        },
    },
    pinia: {
        autoImports: ['defineStore'],
    },
    experimental: {
        emitRouteChunkError: 'automatic',
        sharedPrerenderData: true,
        typedPages: true,
    },
    runtimeConfig: {
        public: {
            appUrl: process.env.NUXT_APP_URL ?? 'http://events-nuxt.test:4224',
            apiUrl: process.env.NUXT_API_URL ?? 'http://127.0.0.1:8000/**',
            description: 'LNF Events is a part of LNF Shipping Alliance is an independent worldwide network for all freight forwarders.',
            keywords:
                'LNF Shipping Alliance, freight forwarders network, global logistics, OTI/NVOCC operations, logistics community, logistics excellence, logistics network, dependable connections, global freight services, freight agents, logistics journey, event, wsa',
        },
    },
    build: {
        transpile: ['@vuepic/vue-datepicker'],
    },
    nitro: {
        routeRules: {
            '/backend/**': {
                proxy: `${process.env.NUXT_API_URL ?? 'http://127.0.0.1:8000'}/**`,
            },
            '/get-geoip/**': {
                proxy: `http://ip-api.com/json/**`,
            },
        },
        compressPublicAssets: true,
    },
    routeRules: {
        // '/dashboard/**': { ssr: false },
    },
    css: ['@/assets/css/main.scss'],
    modules: ['nuxt-lodash', '@pinia/nuxt', 'nuxt-icon', '@nuxtjs/color-mode', '@nuxt/image', 'nuxt-swiper', 'nuxt-headlessui', '@morev/vue-transitions/nuxt', '@unlok-co/nuxt-stripe', 'nuxt-tiptap-editor'],
    image: {
        inject: true,
        quality: 65,
        format: ['webp'],
        screens: {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1536,
        },
    },
    imports: {
        dirs: ['./stores'],
    },
    app: {
        buildAssetsDir: '/wsa-dashboard/',
        rootId: '__wsadashboard',
        head: {
            title: 'LNF Dashboard',
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            htmlAttrs: {
                lang: 'en',
                dir: 'ltr',
            },
        },
        pageTransition: { name: 'page', mode: 'out-in' },
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
    colorMode: {
        preference: 'light', // default value of $colorMode.preference
        fallback: 'light', // fallback value if not system preference found
        hid: 'wsa-dashboard-app-color-mode-script',
        globalName: '__WSA_DASHBOARD_COLOR_MODE__',
        componentName: 'ColorScheme',
        classPrefix: '',
        classSuffix: '',
        storageKey: 'wsa-dashboard-color-mode',
    },
    tiptap: {
        prefix: 'Tiptap',
    },
    plugins: [
        '~/plugins/settings.ts'
      ],
    compatibilityDate: '2024-09-01',
});
