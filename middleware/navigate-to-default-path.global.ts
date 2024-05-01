export default defineNuxtRouteMiddleware((to, from) => {
    if (to.fullPath === '/network-reports') {
        return navigateTo('/network-reports/votes');
    } else if (to.fullPath === '/master-data') {
        return navigateTo('/master-data/countries');
    } else if (to.fullPath === '/website-data') {
        return navigateTo('/website-data/pages');
    }
});
