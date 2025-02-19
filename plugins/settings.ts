export default defineNuxtPlugin(async (nuxtApp) => {
    const settings = useSettingsStore();
    if (settings.conferenceId) {
        await settings.getConference(Number(settings.conferenceId));
    } else {
        await settings.getCurrentConference();
    }
    if (settings.networkId) {
        await settings.getNetwork();
    } else {
        await settings.setNetworkId(1);
        await settings.getNetwork();
    }
    await settings.getAllConference();
    await settings.getActiveNetworks();

    const resources = useResourceStore();
    await resources.fetchResources();
});
