export const useUserStore = defineStore('user', () => {
    const user = ref<Admin>();
    const token = useCookie('WSA_ADMIN_AUTH_TOKEN', {maxAge: 60 * 60 * 2});

    const setToken = (data?: string) => (token.value = data);
    const setUser = (data?: Admin) => (user.value = data);

    const signIn = async (data: Credentials) => {
        await useApiFetch('/sanctum/csrf-cookie');
        const {data: userData, error} = await useApiFetch(`/api/admin/login`, {
            method: 'POST',
            body: data,
            lazy: true,
        });

        if (userData.value) {
            // Data
            useToast({title: 'Welcome', message: 'Logged in Successfully', type: 'success', duration: 5000});
        }

        if (error && error.value) {
            // data
        }
    };
    const fetchAuthUser = async () => {
        if (token.value) {
            const {data: userData, error} = await useApiFetch('/api/event-auth');
            if (userData.value) {

            }
            if (error.value) {
                logout();
                console.log(error.value);
            }
        }
    };
    const logout = () => {
        setToken();
        setUser();
        navigateTo('/login');
    };

    return {
        user,
        token,
        logout,
        signIn,
        fetchAuthUser,
        setUser,
        setToken,
    };
});
