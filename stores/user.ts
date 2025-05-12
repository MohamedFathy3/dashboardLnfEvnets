import type { LocationQueryValue } from 'vue-router';

export const useUserStore = defineStore('user', () => {
    const user = ref<Admin>();
const token = useCookie('WSA_ADMIN_AUTH_TOKEN', { maxAge: 60 * 60 * 2, watch: true });

    const setToken = (data?: string) => (token.value = data);
    const setUser = (data?: Admin) => (user.value = data);

    const login = async (data: Credentials, path?: LocationQueryValue) => {
        await useApiFetch('/sanctum/csrf-cookie');
        const { data: userData, error } = await useApiFetch(`/api/admin/login`, {
            method: 'POST',
            body: data,
        });
        if (userData.value) {
            setUser((userData.value as ApiResponse).data as Admin);
            setToken((userData.value as ApiResponse).token as string);
            useToast({ title: 'Welcome', message: 'Logged in Successfully', type: 'success', duration: 5000 });

            if (path && typeof path === 'string') {
                navigateTo(path);
            } else {
                navigateTo('/');
            }
        }
        if (error.value) {
            const message = error.value.data?.message || 'Login failed';
            useToast({ title: 'Error', message, type: 'error', duration: 5000 });
        }
    };


    const fetchAuthUser = async () => {
        const { data: res, error } = await useApiFetch(`/api/get-admin`, {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as Admin,
        });
        if (res.value) {
            setUser(res.value as Admin);
        }
        if (error && error.value) {
            setUser();
            await logout();
        }
    };

    const logout = async () => {
        await useApiFetch('/api/admin-logout', { method: 'POST' });
        setToken();
        setUser();
        navigateTo('/login');
    };

    return {
        user,
        token,
        logout,
        login,
        fetchAuthUser,
        setUser,
        setToken,
    };
});
