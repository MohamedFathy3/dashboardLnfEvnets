export default defineNuxtRouteMiddleware(async (to) => {
    const userStore = useUserStore();

    // Wait for user fetch if token exists and user not loaded
    if (userStore.token && !userStore.user) {
        await userStore.fetchAuthUser();
    }

    // ✅ Prevent redirect if already going to home (prevent infinite loop)
    // ✅ Allow route to continue if route is / (home)
    // ✅ Only redirect guest if user is already authenticated
    if (userStore.user && to.path === '/login') {
        return navigateTo('/');
    }
});
