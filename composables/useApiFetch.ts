import type { UseFetchOptions } from 'nuxt/app';

export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}) {
    let headers: any = {
        accept: 'application/json',
        referer: process.env.APP_URL ?? 'http://dashboard.wsa.test:4664',
    };

    const token = useCookie('XSRF-TOKEN');

    if (token.value) {
        headers['X-XSRF-TOKEN'] = token.value as string;
    }

    const userStore = useUserStore();
    const settingStore = useSettingsStore();
    const bearerToken = userStore.token; // Assuming you're using localStorage to store the token
    const networkId = settingStore.networkId; // Assuming you're using localStorage to store the token
    const conference = settingStore.conference; // Assuming you're using localStorage to store the token

    if (bearerToken) {
        headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    if (networkId) {
        headers['X-Network-Id'] = networkId;
    }

    if (conference) {
        headers['X-Conference-Id'] = conference.id;
    }

    if (process.server) {
        headers = {
            ...headers,
            ...useRequestHeaders(['cookie']),
        };
    }

    return useFetch('/backend' + path, {
        credentials: 'include',
        ...options,
        watch: false,
        headers: {
            ...headers,
            ...options?.headers,
        },
    });
}
