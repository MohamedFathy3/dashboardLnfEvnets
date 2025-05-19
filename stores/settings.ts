export const useSettingsStore = defineStore('settings', () => {
  const networkId = useCookie('WSA_CURRENT_NETWORK_ID', { maxAge: 60 * 60 * 2 });
  const conferenceId = useCookie('WSA_CURRENT_CONFERENCE_ID', { maxAge: 60 * 60 * 2 });

  const network = ref<Network>();
  const networks = ref<Network[]>([]);
  const conference = ref<Conference>();
  const conferences = ref<Conference[]>([]);

  const setNetworkId = (data?: any) => {
    networkId.value = data || 1;
  };
  const setNetwork = (data?: Network) => network.value = data;
  const setNetworks = (data?: Network[]) => networks.value = data || [];

  const setConference = (data?: Conference) => conference.value = data;
  const setConferences = (data?: Conference[]) => conferences.value = data || [];
  const setConferenceId = (data?: any) => conferenceId.value = data;

  const getNetwork = async () => {
    const { data: res, error } = await useApiFetch('/api/current-network', {
      lazy: true,
      transform: (res) => (res as ApiResponse).data as Network,
    });
    if (res.value) setNetwork(res.value);
    if (error.value) console.error(error);
  };

  const getActiveNetworks = async () => {
    const { data: res, error } = await useApiFetch('/api/network-public', {
      lazy: true,
      transform: (res) => (res as ApiResponse).data as Network[],
    });
    if (res.value) setNetworks(res.value);
    if (error.value) console.error(error);
  };

  const getCurrentConference = async () => {
    const { data: res, error } = await useApiFetch('/api/conference-current', {
      lazy: true,
      transform: (res) => (res as ApiResponse).data as Conference,
    });
    if (res.value) {
      setConferenceId(res.value.id);
      setConference(res.value);
    }
    if (error.value) {
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
      setConferenceId(res.value.id);
      setConference(res.value);
    }
    if (error.value) {
      setConference();
      console.error(error);
    }
  };

  const getAllConference = async () => {
    const { data: res, error } = await useApiFetch('/api/conference-public', {
      lazy: true,
      transform: (res) => (res as ApiResponse).data as Conference[],
    });
    if (res.value) setConferences(res.value);
    if (error.value) {
      setConferences();
      console.error(error);
    }
  };

  return {
    networkId,
    setNetworkId,
    network,
    networks,
    setNetwork,
    setNetworks,
    getNetwork,
    getActiveNetworks,
    conferenceId,
    conference,
    conferences,
    setConference,
    setConferences,
    getCurrentConference,
    getAllConference,
    getConference,
    setConferenceId,
  };
});
