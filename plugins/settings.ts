export default defineNuxtPlugin(async (nuxtApp) => {
    const settings = useSettingsStore();
    if (settings.conferenceId) {
        await settings.getConference(Number(settings.conferenceId));
    } else {
        await settings.getCurrentConference();
    }
    await settings.getAllConference();
    await settings.getNetwork();
    await settings.getActiveNetworks();

    const resources = useResourceStore();
    await resources.fetchCountries();
    await resources.fetchCities();
    await resources.fetchCertificates();
    await resources.fetchServices();
    await resources.fetchReferrals();
    await resources.fetchDietaries();
});
