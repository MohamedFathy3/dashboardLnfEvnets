export const useSettingsStore = defineStore('settings', () => {
    const networkId = ref<number>(1);
    const conferenceId = useCookie('WSA_CURRENT_CONFERENCE_ID', { maxAge: 60 * 60 * 2 });
    const network = ref<Network>();
    const networks = ref<Network[]>();
    const conference = ref<Conference>();
    const conferences = ref<Conference[]>();
    // const settings = ref<PublicSetting[]>();

    const setConferenceId = (data?: any) => {
        conferenceId.value = data;
    };
    const setConference = (data?: Conference) => {
        conference.value = data;
    };
    const setConferences = (data?: Conference[]) => {
        conferences.value = data;
    };
    const setNetwork = (data?: Network) => {
        network.value = data;
    };
    const setNetworks = (data?: Network[]) => {
        networks.value = data;
    };
    const setNetworkId = (data?: number) => {
        networkId.value = data ? data : 1;
    };

    const getCurrentConference = async () => {
        const { data: res, error } = await useApiFetch('/api/conference-current', {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as Conference,
        });
        if (res.value) {
            setConferenceId((res.value as Conference).id);
            setConference(res.value as Conference);
        }
        if (error && error.value) {
            setConference();
            console.error(error);
        }
    };
    const getConference = async (id: number) => {
        const { data: res, error } = await useApiFetch(`/api/dashboard/fetch-conference/${id}`, {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as Conference,
        });
        if (res.value) {
            setConferenceId((res.value as Conference).id);
            setConference(res.value as Conference);
        }
        if (error && error.value) {
            setConference();
            console.error(error);
        }
    };
    const getAllConference = async () => {
        const { data: res, error } = await useApiFetch('/api/conference-public', {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as Conference[],
        });
        if (res.value) {
            setConferences(res.value as Conference[]);
        }
        if (error && error.value) {
            setConferences();
            console.error(error);
        }
    };
    const getNetwork = async () => {
        const { data: res, error } = await useApiFetch(`/api/current-network`, {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as Network,
        });
        if (res.value) {
            setNetwork(res.value as Network);
        }
        if (error && error.value) {
            setNetwork();
            console.error(error);
        }
    };
    const getActiveNetworks = async () => {
        const { data: res, error } = await useApiFetch(`/api/network-public`, {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as Network[],
        });
        if (res.value) {
            setNetworks(res.value as Network[]);
        }
        if (error && error.value) {
            setNetworks();
            console.error(error);
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
        networks,
        setNetworks,
        getActiveNetworks,
        conferences,
        setConferences,
        getAllConference,
        setConferenceId,
        conferenceId,
        getConference,
    };
});
