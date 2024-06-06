export const useResourceStore = defineStore('resource', () => {
    const countries = ref<Country[]>();
    const cities = ref<City[]>();
    const certificates = ref<Resource[]>();
    const dietaries = ref<Resource[]>();
    const services = ref<Resource[]>();
    const referrals = ref<Resource[]>();
    const shirts = ref<Resource[]>();

    const setCountries = (data?: Country[]) => {
        countries.value = data;
    };
    const setCities = (data?: City[]) => {
        cities.value = data;
    };
    const setCertificates = (data?: Resource[]) => {
        certificates.value = data;
    };
    const setServices = (data?: Resource[]) => {
        services.value = data;
    };
    const setReferrals = (data?: Resource[]) => {
        referrals.value = data;
    };
    const setDietaries = (data?: Resource[]) => {
        dietaries.value = data;
    };
    const setShirts = (data?: Resource[]) => {
        shirts.value = data;
    };
    const fetchResources = async () => {
        const { data: res, error } = await useApiFetch(`/api/fetch-event-resources`, {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as any,
        });
        if (res.value) {
            setCountries((res.value as any).countries as Country[]);
            setCities((res.value as any).cities as City[]);
            setCertificates((res.value as any).certificates as Resource[]);
            setServices((res.value as any).services as Resource[]);
            setReferrals((res.value as any).referrals as Resource[]);
            setDietaries((res.value as any).dietaries as Resource[]);
            setShirts((res.value as any).shirts as Resource[]);
        }
        if (error && error.value) {
            setCountries();
            setCities();
            setCertificates();
            setServices();
            setReferrals();
            setDietaries();
            setShirts();
            console.error(error);
        }
    };

    return {
        countries,
        cities,
        certificates,
        dietaries,
        services,
        referrals,
        shirts,
        setCountries,
        setCities,
        setCertificates,
        setServices,
        setReferrals,
        setDietaries,
        setShirts,
        fetchResources,
    };
});
