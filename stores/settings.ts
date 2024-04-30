export const useSettingsStore = defineStore('settings', () => {
    const networkId = ref<number>(1);
    const network = ref<Network>();
    const conference = ref<Conference>();

    const setConference = (data?: Conference) => {
        conference.value = data;
    };

    const setNetwork = (data?: Network) => {
        network.value = data;
    };

    const setNetworkId = (data?: number) => {
        networkId.value = data ? data : 1;
    };

    const getCurrentConference = async () => {
        const {data: res, error} = await useApiFetch('/api/conference-current', {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as Conference
        });
        if (res.value) {
            setConference(res.value as Conference)
        }
        if (error && error.value) {
            setConference()
            console.error(error)
        }
    };
    const getNetwork = async () => {
        const {data: res, error} = await useApiFetch(`/api/current-network`, {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as Network
        });
        if (res.value) {
            setNetwork(res.value as Network)
        }
        if (error && error.value) {
            setNetwork()
            console.error(error)
        }
    };

    return {
        setConference,
        setNetwork,
        setNetworkId,
        getCurrentConference,
        getNetwork,
        network,
        networkId,
        conference,
    };
});
