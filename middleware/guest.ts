export default defineNuxtRouteMiddleware(async (to) => {
    const userStore = useUserStore();
  
    // Only fetch user if token exists and user not yet loaded
    if (userStore.token && !userStore.user) {
      try {
        await userStore.fetchAuthUser();
      } catch (err) {
        // optional: log error or silently fail
      }
    }
  
    // If authenticated, redirect to home (or dashboard)
    if (userStore.user && to.path !== '/') {
      return navigateTo('/');
    }
  });
  