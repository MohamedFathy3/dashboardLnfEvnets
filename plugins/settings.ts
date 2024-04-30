export default defineNuxtPlugin(async (nuxtApp) => {
    const settingsStore = useSettingsStore();
    await settingsStore.getCurrentConference()
    await settingsStore.getNetwork()

    const resourceStore = useResourceStore()
    await resourceStore.fetchCountries()
    await resourceStore.fetchCertificates()
    await resourceStore.fetchServices()
    await resourceStore.fetchReferrals()
})
