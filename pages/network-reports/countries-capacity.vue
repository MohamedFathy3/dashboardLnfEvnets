<script setup>
definePageMeta({
    middleware: 'auth',
});

const membersByCountryList = ref([]);
const isLoading = ref(false);
const isOpen = ref(false);
const listLoading = ref(false);
const resetMembersList = async () => {
    membersByCountryList.value = [];
};

const selectedList = ref('used');
const list = ref([
    { id: 'used', name: 'Countries with Members' },
    { id: 'empty', name: 'Empty Countries' },
]);

const rows = ref([]);

const fetchDataList = async () => {
    if (selectedList.value === 'used') {
        const { data: usedCountries } = await useApiFetch('/api/user-total-count-country');
        rows.value = usedCountries.value;
    } else if (selectedList.value === 'empty') {
        const { data: emptyCountries } = await useApiFetch('/api/unused-country');
        rows.value = emptyCountries.value;
    }
};

const fetchMembersByCountry = async (id) => {
    isLoading.value = true;
    await resetMembersList();
    if (id) {
        const { data, error } = await useApiFetch(`/api/get-user-by-country/${id}`, {
            lazy: true,
        });

        if (data.value) {
            isLoading.value = false;
            membersByCountryList.value = data.value.data;
            isOpen.value = true;
        }
        if (error.value) {
            isLoading.value = false;
            useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
        }
    } else {
        isLoading.value = false;
        useToast({ title: 'Error', message: 'Country ID is not defined or null', type: 'error', duration: 5000 });
    }
};

async function closeModal() {
    isOpen.value = false;
    await resetMembersList();
}

const changeSelectedList = async (id) => {
    listLoading.value = true;
    selectedList.value = id;
    await fetchDataList();
    listLoading.value = false;
};

onMounted(async () => {
    await fetchDataList();
});

const exportLoading = ref(false);
const config = useRuntimeConfig();
const initDownloadByType = async () => {
    exportLoading.value = true;
    if (selectedList.value === 'used') {
        const networkUrl = config.public.apiUrl + '/export-excel/total-count-per-country';
        navigateTo(networkUrl, {
            external: true,
        });
    } else if (selectedList.value === 'empty') {
        const networkUrl = config.public.apiUrl + '/export-excel/unused-country';
        navigateTo(networkUrl, {
            external: true,
        });
    }

    exportLoading.value = false;
};
</script>
<template>
    <div v-if="usePermissionCheck(['network_report_countries_capacity'])" class="flex flex-col gap-8">
        <!-- Page Title & Action Buttons -->
        <div class="md:flex md:items-center md:justify-between md:gap-5">
            <div class="flex items-center gap-2">
                <Icon name="solar:planet-3-outline" class="size-5 opacity-75" />
                <div>Countries Capacity</div>
            </div>
            <button :disabled="exportLoading" class="btn btn-dark btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="initDownloadByType">
                <Icon name="solar:cloud-download-outline" class="size-5 shrink-0 opacity-75" />
                Download XLXS
            </button>
        </div>
        <div>
            <ul class="w-full grid gap-5 lg:grid-cols-2 bg-white p-2 rounded-full">
                <li
                    v-for="listItem in list"
                    :key="listItem.id"
                    :class="listItem.id === selectedList ? 'btn-primary' : 'btn-secondary opacity-50 hover:opacity-100'"
                    class="text-center btn btn-primary btn-rounded py-1 px-6 w-full"
                    @click="changeSelectedList(listItem.id)"
                >
                    {{ listItem.name }}
                </li>
            </ul>
        </div>
        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="table relative table-report font-light">
                <thead>
                    <tr class="uppercase text-sm sticky top-5">
                        <th>Country</th>
                        <th class="text-center">Ref</th>
                        <th v-if="selectedList === 'used'" class="text-center">Approved</th>
                        <th v-if="selectedList === 'used'" class="text-center">Suspended</th>
                        <th v-if="selectedList === 'used'" class="text-center">HQ</th>
                        <th v-if="selectedList === 'used'" class="text-center">Branch</th>
                        <th v-if="selectedList === 'used'" class="whitespace-nowrap">Available Slots</th>
                        <th v-if="selectedList === 'used'" class="text-right">View</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="!listLoading && rows">
                        <tr v-for="row in rows" :key="row.id">
                            <td class="text-sm font-normal whitespace-nowrap">
                                <div class="flex items-center gap-5 justify-between">
                                    <div class="flex items-center gap-3">
                                        <NuxtImg :alt="row.country?.name" :src="row.country?.imageUrl" :title="row.country?.name" class="w-8 h-5 rounded-full !object-cover" />
                                        <div class="font-light truncate">{{ row.country?.name }}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="flex place-content-center text-sm text-center">
                                    <div class="mt-1.5 flex items-center">
                                        <div class="font-medium py-0.5 px-1.5 bg-slate-100 border rounded-lg">{{ row.capacity }}</div>
                                    </div>
                                </div>
                            </td>
                            <td v-if="selectedList === 'used'">
                                <div class="flex place-content-center text-sm text-center">
                                    <div class="mt-1.5 flex items-center">
                                        <div class="font-medium py-0.5 px-1.5 bg-success/15 text-success border border-success/15 rounded-md">{{ row.userCountApproved }}</div>
                                    </div>
                                </div>
                            </td>

                            <td v-if="selectedList === 'used'">
                                <div class="flex place-content-center text-sm text-center">
                                    <div class="mt-1.5 flex items-center">
                                        <div class="font-medium py-0.5 px-1.5 bg-warning/15 text-yellow-700 border border-warning/15 rounded-md">{{ row.userCountSuspended }}</div>
                                    </div>
                                </div>
                            </td>
                            <td v-if="selectedList === 'used'">
                                <div class="flex place-content-center text-sm text-center">
                                    <div class="mt-1.5 flex items-center">
                                        <div class="font-medium py-0.5 px-1.5 bg-slate-50 border rounded-md">{{ row.hqCount }}</div>
                                    </div>
                                </div>
                            </td>
                            <td v-if="selectedList === 'used'">
                                <div class="flex place-content-center text-sm text-center">
                                    <div class="mt-1.5 flex items-center">
                                        <div class="font-medium py-0.5 px-1.5 bg-slate-50 border rounded-md">{{ row.branchCount }}</div>
                                    </div>
                                </div>
                            </td>
                            <td v-if="selectedList === 'used'">
                                <div class="flex place-content-center text-sm text-center">
                                    <span
                                        :class="[
                                            row.capacity - row.hqCount > 0 && 'bg-slate-100',
                                            row.capacity === row.hqCount && 'bg-success/15 border-success/15 text-success',
                                            row.hqCount > row.capacity && 'bg-danger/15 border-danger/15 text-danger',
                                        ]"
                                        class="font-medium py-0.5 px-1.5 border rounded-md"
                                    >
                                        {{ row.capacity - row.hqCount }}
                                    </span>
                                </div>
                            </td>
                            <td v-if="selectedList === 'used'" class="text-right">
                                <div>
                                    <button :disabled="isLoading" class="btn btn-secondary btn-rounded btn-sm gap-3 size-8" @click="fetchMembersByCountry(row.country.id)">
                                        <Icon name="solar:eye-outline" class="size-4 shrink-0" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td :colspan="selectedList === 'used' ? 8 : 2">
                                <div class="text-center">Loading Data</div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <TheModal :open-modal="isOpen" size="5xl" @close-modal="closeModal()">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="font-medium">View Member List</div>
                    <Icon class="w-8 h-8 opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300" name="solar:close-square-outline" @click="closeModal" />
                </div>
            </template>
            <template #content>
                <div>
                    <table class="table table-report font-light w-full">
                        <tbody>
                            <template v-if="membersByCountryList.length > 0">
                                <template v-for="row in membersByCountryList" :key="row.id">
                                    <tr>
                                        <td class="text-sm font-normal whitespace-nowrap">
                                            <div class="flex items-center gap-3">
                                                <NuxtImg :src="row.imageUrl" class="h-10 !rounded-md w-20 object-contain p-1 shrink-0" />
                                                <div class="flex flex-col gap-0.5">
                                                    <div class="flex items-center gap-1.5">
                                                        <span class="truncate 2xl:max-w-44 max-w-36 text-xs">{{ row.name }}</span>
                                                        <Icon v-if="row.currentNetworkStatus?.fpp" name="solar:shield-star-bold" class="size-5 text-success" />
                                                    </div>
                                                    <div class="flex items-center text-xs whitespace-nowrap">
                                                        <NuxtImg :src="row.country?.imageUrl" class="h-4 !rounded-sm w-6 object-cover shrink-0 mr-1.5" />
                                                        <div class="opacity-75 font-semibold truncate">{{ row.country.name }}</div>
                                                        <span class="capitalize font-light opacity-80 truncate">, {{ row.city.toLowerCase() }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="font-medium">
                                                <div class="text-xs capitalize opacity-75">
                                                    <span class="font-light">Expire in: </span>
                                                    {{ row.currentNetworkStatus?.expireDaysLeft }}
                                                </div>
                                                <div class="mt-0.5 flex items-center gap-0.5">
                                                    <div class="flex items-center gap-1.5">
                                                        <UiCompanyTypeBadge v-if="row.typeCompany" :data="row.typeCompany" />
                                                        <UiNetworkTypeBadge :data="row.currentNetworkStatus?.type" />
                                                        <UiStatusBadge v-if="row.currentNetworkStatus?.status !== 'approved'" :data="row.currentNetworkStatus?.status" />
                                                        <UiActiveBadge v-if="!row.currentNetworkStatus?.active" :data="row.currentNetworkStatus?.active" />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="text-right">
                                            <div>
                                                <NuxtLink :to="'/members-data/members/' + row.id">
                                                    <button class="btn btn-secondary btn-rounded btn-sm gap-3 size-8">
                                                        <Icon name="solar:eye-outline" class="size-4 shrink-0" />
                                                    </button>
                                                </NuxtLink>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </template>
                        </tbody>
                    </table>
                </div>
            </template>
            <template #footer>
                <div class="w-full flex items-center justify-end gap-5">
                    <button :disabled="isLoading" class="btn-rounded btn-sm btn btn-danger px-4" type="button" @click="closeModal">
                        <Icon :name="isLoading ? 'svg-spinners:3-dots-fade' : 'solar:close-circle-linear'" class="w-5 h-5 mr-2" />
                        <span>Close</span>
                    </button>
                </div>
            </template>
        </TheModal>
    </div>
</template>
