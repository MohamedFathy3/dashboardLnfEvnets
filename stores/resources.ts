export const useResourceStore = defineStore('resource', () => {
    const countries = ref<Country[]>();
    const cities = ref<City[]>();
    const certificates = ref<Resource[]>();
    const services = ref<Resource[]>();
    const referrals = ref<Resource[]>();

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

    const fetchCountries = async () => {
        const { data: res, error } = await useApiFetch(`/api/country-public`, {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as Country[],
        });
        if (res.value) {
            setCountries(res.value as Country[]);
        }
        if (error && error.value) {
            setCountries();
            console.error(error);
        }
    };
    const fetchCities = async () => {
        const { data: res, error } = await useApiFetch(`/api/city-public`, {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as City[],
        });
        if (res.value) {
            setCities(res.value as City[]);
        }
        if (error && error.value) {
            setCities();
            console.error(error);
        }
    };
    const fetchCertificates = async () => {
        const { data: res, error } = await useApiFetch(`/api/certificate-public`, {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as Resource[],
        });
        if (res.value) {
            setCertificates(res.value as Resource[]);
        }
        if (error && error.value) {
            setCertificates();
            console.error(error);
        }
    };
    const fetchServices = async () => {
        const { data: res, error } = await useApiFetch(`/api/service-public`, {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as Resource[],
        });
        if (res.value) {
            setServices(res.value as Resource[]);
        }
        if (error && error.value) {
            setServices();
            console.error(error);
        }
    };
    const fetchReferrals = async () => {
        const { data: res, error } = await useApiFetch(`/api/referral-public`, {
            lazy: true,
            transform: (res) => (res as ApiResponse).data as Resource[],
        });
        if (res.value) {
            setReferrals(res.value as Resource[]);
        }
        if (error && error.value) {
            setReferrals();
            console.error(error);
        }
    };

    return {
        countries,
        setCountries,
        fetchCountries,
        certificates,
        setCertificates,
        fetchCertificates,
        services,
        setServices,
        fetchServices,
        referrals,
        setReferrals,
        fetchReferrals,
        cities,
        fetchCities,
        setCities,
    };
});
