<script setup>
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

definePageMeta({
    middleware: 'auth',
});
const selectedRows = ref([]);
const sortByList = ref([
    { name: 'Sort By Name', value: 'name' },
    { name: 'Sort By ID', value: 'wsa_id' },
]);
const filter = ref({
    name: null,
    countryId: null,
    wsaId: null,
    companyEmail: null,
    email: null,
});
const networkFilter = ref({
    active: null,
    fpp: null,
    network: null,
});
const membershipTypes = ref([
    { name: 'Member', value: 'member' },
    { name: 'Founder', value: 'founder' },
    { name: 'Partner', value: 'partner' },
    { name: 'Vendor', value: 'vendor' },
    { name: 'Non Member', value: 'non_member' },
    { name: 'WSA Team', value: 'wsa_team' },
]);
const membershipStatuses = ref([
    // { name: 'Pending', value: 'pending' },
    { name: 'Approved', value: 'approved' },
    { name: 'Suspended', value: 'suspended' },
    { name: 'Blacklisted', value: 'blacklisted' },
]);
const serverParams = ref({
    filters: {},
    networkFilter: {
        status: ['approved', 'suspended', 'blacklisted'],
        type: [],
        networkIds: [],
    },
    orderBy: 'wsa_id',
    orderByDirection: 'asc',
    perPage: 10,
    page: 1,
    paginate: true,
    deleted: false,
});
const resources = useResourceStore();
const showFilter = ref(false);

function toggleShowMoreFilterOptions() {
    showFilter.value = !showFilter.value;
}
const resetServerParams = async () => {
    filter.value = {
        name: null,
        countryId: null,
        wsaId: null,
        companyEmail: null,
        email: null,
    };
    networkFilter.value = {
        active: null,
        fpp: null,
        network: null,
    };
    serverParams.value = {
        filters: {},
        networkFilter: {
            status: ['approved', 'suspended', 'blacklisted'],
            type: [],
            networkIds: [],
        },
        orderBy: 'wsa_id',
        orderByDirection: 'asc',
        perPage: 10,
        page: 1,
        paginate: true,
        deleted: false,
    };
    selectedRows.value = [];
    await refresh();
};
const {
    data: rows,
    status,
    refresh,
} = await useApiFetch('/api/user/index', {
    method: 'POST',
    body: serverParams,
    lazy: true,
});
const onExport = async () => {
    const exportServerParams = { ...serverParams.value };
    exportServerParams.perPage = rows.value?.meta?.total || 25;
    const { data: exportData, error: errorExport } = await useApiFetch('/api/user/index', {
        method: 'POST',
        body: exportServerParams,
    });
    if (exportData.value) {
        const worksheet = XLSX.utils.json_to_sheet(exportData.value.data);
        const workbook = XLSX.utils.book_new();
        const fileName = `WSA_Members_${new Date().toLocaleDateString()}_${new Date().getHours()}_${new Date().getMinutes()}.xlsx`;
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        const data = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(blob, fileName);
    }
    if (errorExport.value) {
        console.error('Error exporting data:', errorExport.value);
    }
};
watch(
    filter,
    (newVal) => {
        for (const key in newVal) {
            const value = newVal[key];
            if (value) {
                serverParams.value.filters[key] = value;
            } else {
                delete serverParams.value.filters[key];
            }
        }
    },
    { deep: true },
);
watch(
    networkFilter,
    (newVal) => {
        for (const key in newVal) {
            const value = newVal[key];
            if (value) {
                serverParams.value.networkFilter[key] = value;
            } else {
                delete serverParams.value.networkFilter[key];
            }
        }
    },
    { deep: true },
);
const toggleDeleted = async () => {
    serverParams.value.deleted = !serverParams.value.deleted;
    selectedRows.value = [];
    await refresh();
};
const isSelected = (id) => {
    return selectedRows.value.some((r) => r === id);
};
const allSelected = computed(() => {
    return rows?.value?.data.every((row) => selectedRows.value.includes(row.id));
});
const selectAllRows = () => {
    const allSelected = rows.value.data.every((row) => isSelected(row.id));
    if (allSelected) {
        selectedRows.value = [];
    } else {
        rows.value.data.forEach((row) => {
            const id = row.id;
            if (!isSelected(id)) {
                selectedRows.value.push(id);
            }
        });
    }
};
const changePage = async (value) => {
    const pageNumber = parseInt(value);
    if (!isNaN(pageNumber)) {
        serverParams.value.page = pageNumber;
    } else {
        console.error('Invalid page number:', value);
    }
    selectedRows.value = [];
    await refresh();
};
const toggleRowSelection = (id) => {
    const index = selectedRows.value.indexOf(id);
    if (index === -1) {
        selectedRows.value.push(id);
    } else {
        selectedRows.value.splice(index, 1);
    }
};

async function deleteItems() {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if (confirmed) {
        const { data, error } = await useApiFetch(`/api/user/delete`, {
            body: { items: selectedRows.value },
            method: 'DELETE',
            lazy: true,
        });
        if (data.value) {
            useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
            await refresh();
        }
        if (error.value) {
            useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
        }
    }
}
async function forceDeleteItems() {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if (confirmed) {
        const { data, error } = await useApiFetch(`/api/user/force-delete`, {
            body: { items: selectedRows.value },
            method: 'DELETE',
            lazy: true,
        });
        if (data.value) {
            useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
            await refresh();
        }
        if (error.value) {
            useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
        }
    }
}
async function restoreItems() {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if (confirmed) {
        const { data, error } = await useApiFetch(`/api/user/restore`, {
            body: { items: selectedRows.value },
            method: 'POST',
            lazy: true,
        });
        if (data.value) {
            useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
            await refresh();
        }
        if (error.value) {
            useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
        }
    }
}

const networkInfoBoxes = ref([]);
const { data: networkStatistics, execute: fetchNetworkStatistics } = await useApiFetch('/api/dashboard/network/user-statistic', {
    immediate: false,
    lazy: true,
});
async function prepareInfoBoxes() {
    await fetchNetworkStatistics();
    networkInfoBoxes.value = [
        {
            title: 'Approved',
            icon: 'solar:users-group-two-rounded-outline',
            value: networkStatistics.value.totalApproved,
            description: 'Members',
        },
        {
            title: 'Countries',
            icon: 'solar:earth-outline',
            value: networkStatistics.value.totalCountriesWithMembers,
            description: 'With Members',
        },
        {
            title: 'Suspended',
            icon: 'solar:user-minus-rounded-line-duotone',
            value: networkStatistics.value.totalSuspended,
            description: 'Members',
        },
        {
            title: 'Blacklisted',
            icon: 'solar:user-cross-rounded-line-duotone',
            value: networkStatistics.value.totalBlacklisted,
            description: 'Members',
        },
    ];
}

onMounted(() => {
    prepareInfoBoxes();
});
</script>
<template>
    <div v-if="usePermissionCheck(['network_member_list'])" class="flex flex-col gap-8">
        <!-- Page Title & Action Buttons -->
        <div class="md:flex md:items-center md:justify-between md:gap-5">
            <div class="flex items-center gap-2">
                <Icon name="solar:case-minimalistic-linear" class="size-5 opacity-75" />
                <div>{{ serverParams.deleted ? 'Deleted Members' : 'Members' }}</div>
            </div>
            <div class="md:flex md:items-center md:gap-5 md:space-y-0 space-y-5">
                <button v-if="usePermissionCheck(['network_member_export'])" class="btn btn-dark btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" type="button" @click="onExport">
                    <Icon name="solar:download-outline" class="size-5 opacity-75" />
                    <span>Export XLSX</span>
                </button>
                <template v-if="selectedRows.length > 0">
                    <template v-if="serverParams.deleted">
                        <button v-if="usePermissionCheck(['network_member_force_delete'])" class="btn btn-danger btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="forceDeleteItems">
                            <Icon name="solar:trash-bin-minimalistic-line-duotone" class="size-5 opacity-75" />
                            Delete Permanently
                        </button>
                    </template>
                    <template v-else>
                        <button v-if="usePermissionCheck(['network_member_delete'])" class="btn btn-danger btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="deleteItems">
                            <Icon name="solar:trash-bin-minimalistic-line-duotone" class="size-5 opacity-75" />
                            Delete Items
                        </button>
                    </template>
                    <template v-if="serverParams.deleted">
                        <button v-if="usePermissionCheck(['network_member_restore'])" class="btn btn-success btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="restoreItems">
                            <Icon name="solar:restart-circle-outline" class="size-5 opacity-75" />
                            Restore Items
                        </button>
                    </template>
                </template>
                <button v-if="usePermissionCheck(['network_member_force_delete', 'network_member_delete', 'network_member_restore'])" class="btn btn-primary btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="toggleDeleted">
                    <Icon :name="serverParams.deleted ? 'solar:hamburger-menu-line-duotone' : 'solar:trash-bin-minimalistic-line-duotone'" class="size-5 opacity-75" />
                    {{ serverParams.deleted ? 'Active Members List' : 'Deleted Members' }}
                </button>
            </div>
        </div>
        <!-- Network Members Statistics -->
        <UiInfoBox :data="networkInfoBoxes" />
        <!-- Filter & Search -->
        <div class="grid lg:grid-cols-12 gap-5 items-center p-5 bg-white border rounded-2xl">
            <FormInputField v-model="filter.name" rounded class="xl:col-span-4 lg:col-span-4" placeholder="Company Name" />
            <FormInputField v-model="filter.wsaId" rounded class="xl:col-span-4 lg:col-span-4" placeholder="WSA ID" type="number" />
            <FormSelectField
                id="add-member-country-filter"
                v-model="filter.countryId"
                name="add-member-country-filter"
                class="lg:col-span-4 xl:col-span-4"
                placeholder="Please select a country..."
                :select-data="resources.countries"
                labelvalue="name"
                keyvalue="id"
                imgvalue="imageUrl"
            />
            <TransitionExpand>
                <div v-if="showFilter" class="lg:col-span-12 grid lg:grid-cols-12 gap-5 items-center">
                    <FormInputField v-model="filter.email" rounded class="xl:col-span-4 lg:col-span-4" placeholder="Login Email" />
                    <FormInputField v-model="filter.companyEmail" rounded class="xl:col-span-4 lg:col-span-4" placeholder="Company Email" />
                    <FormSelectField
                        id="add-member-active-filter"
                        v-model="networkFilter.active"
                        :clearable="false"
                        name="add-member-active-filter"
                        class="lg:col-span-4 xl:col-span-4"
                        placeholder="Please select an option..."
                        :select-data="[
                            { name: 'All (Active) Statuses', value: null },
                            { name: 'Active', value: true },
                            { name: 'Inactive', value: false },
                        ]"
                        labelvalue="name"
                        keyvalue="value"
                    />
                    <FormSelectField
                        id="add-member-fpp-filter"
                        v-model="networkFilter.fpp"
                        :clearable="false"
                        name="add-member-active-filter"
                        class="lg:col-span-6 xl:col-span-6"
                        placeholder="Please select an option..."
                        :select-data="[
                            { name: 'All (FPP) Statuses', value: null },
                            { name: 'FPP is Active', value: true },
                            { name: 'FPP is Inactive', value: false },
                        ]"
                        labelvalue="name"
                        keyvalue="value"
                    />
                    <FormSelectField
                        id="add-member-network-filter"
                        v-model="networkFilter.network"
                        :clearable="false"
                        name="add-member-active-filter"
                        class="lg:col-span-6 xl:col-span-6"
                        placeholder="Please select an option..."
                        :select-data="[
                            { name: 'All (Show in Network) Statuses', value: null },
                            { name: 'Directory Show Active', value: true },
                            { name: 'Directory Show Inactive', value: false },
                        ]"
                        labelvalue="name"
                        keyvalue="value"
                    />
                    <div class="lg:col-span-12">
                        <div class="border border-slate-100 bg-slate-50/50 rounded-lg grid grid-cols-12 p-5 gap-5">
                            <div class="sm:col-span-12">
                                <fieldset class="px-5 grid lg:grid-cols-3 sm:grid-cols-2 gap-5 grid-cols-1 duration-300 ease-in-out">
                                    <div v-for="option in membershipTypes" :key="option.value" class="relative flex items-start">
                                        <div class="flex items-center h-6">
                                            <input
                                                :id="option.value"
                                                v-model="serverParams.networkFilter.type"
                                                :checked="membershipTypes.includes(option.value)"
                                                :aria-describedby="option.value + '-description'"
                                                :name="option.value"
                                                :value="option.value"
                                                type="checkbox"
                                                class="focus:ring-primary h-5 w-5 rounded text-primary border-slate-500 disabled:read-only:opacity-50 disabled:read-only:cursor-not-allowed"
                                            />
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label
                                                :for="option.value"
                                                :class="[serverParams.networkFilter.type.includes(option.value) ? ' font-medium opacity-75' : 'font-light']"
                                                class="font-light disabled:read-only:opacity-25 font-sm ease-in-out duration-150"
                                            >
                                                {{ option.name }}
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div class="lg:col-span-12">
                        <div class="border border-slate-100 bg-slate-50/50 rounded-lg grid grid-cols-12 p-5 gap-5">
                            <div class="sm:col-span-12">
                                <fieldset class="px-5 grid lg:grid-cols-3 sm:grid-cols-2 gap-5 grid-cols-1 duration-300 ease-in-out">
                                    <div v-for="option in membershipStatuses" :key="option.value" class="relative flex items-start">
                                        <div class="flex items-center h-6">
                                            <input
                                                :id="option.value"
                                                v-model="serverParams.networkFilter.status"
                                                :checked="membershipStatuses.includes(option.value)"
                                                :aria-describedby="option.value + '-description'"
                                                :name="option.value"
                                                :value="option.value"
                                                type="checkbox"
                                                class="focus:ring-primary h-5 w-5 rounded text-primary border-slate-500 disabled:read-only:opacity-50 disabled:read-only:cursor-not-allowed"
                                            />
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label
                                                :for="option.value"
                                                :class="[serverParams.networkFilter.status.includes(option.value) ? ' font-medium opacity-75' : 'font-light']"
                                                class="disabled:read-only:opacity-25 font-sm ease-in-out duration-150"
                                            >
                                                {{ option.name }}
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <FormSelectField v-model="serverParams.orderBy" :clearable="false" class="xl:col-span-6 lg:col-span-6" labelvalue="name" keyvalue="value" placeholder="Sort Direction" :select-data="sortByList" />
                    <FormSelectField
                        v-model="serverParams.orderByDirection"
                        class="xl:col-span-6 lg:col-span-6"
                        :clearable="false"
                        labelvalue="name"
                        keyvalue="value"
                        placeholder="Sort Direction"
                        :select-data="[
                            { name: 'Z : A', value: 'desc' },
                            { name: 'A : Z', value: 'asc' },
                        ]"
                    />
                </div>
            </TransitionExpand>
            <button class="xl:col-span-4 lg:col-span-4 btn btn-rounded btn-sm btn-primary gap-3 w-full" @click="refresh">
                <Icon name="solar:rounded-magnifer-line-duotone" class="size-5 shrink-0" />
                Filter
            </button>
            <button class="xl:col-span-4 lg:col-span-4 btn btn-rounded btn-sm btn-secondary gap-3 w-full" @click="resetServerParams">
                <Icon name="solar:restart-circle-outline" class="size-5 shrink-0" />
                Reset
            </button>
            <button class="xl:col-span-4 lg:col-span-4 btn btn-rounded btn-sm btn-secondary gap-3 w-full" @click="toggleShowMoreFilterOptions">
                <Icon name="solar:filter-linear" class="size-5 shrink-0" />
                More Filter Options
            </button>
        </div>
        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="table table-report font-light">
                <thead>
                    <tr class="uppercase text-sm">
                        <th class="text-left">
                            <input v-model="allSelected" type="checkbox" class="form-check-input" @change="selectAllRows" />
                        </th>
                        <th>Name</th>
                        <th>Type</th>
                        <th v-if="!serverParams.deleted">Status</th>
                        <th v-if="serverParams.deleted">Deleted At</th>
                        <th v-if="!serverParams.deleted" class="text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="status !== 'pending' && rows">
                        <tr v-for="row in rows.data" :key="row.id">
                            <td>
                                <input :checked="isSelected(row.id)" type="checkbox" class="form-check-input" @change="toggleRowSelection(row.id)" />
                            </td>
                            <td class="text-sm font-normal whitespace-nowrap">
                                <div class="flex items-center gap-3">
                                    <NuxtImg :src="row.imageUrl" class="h-14 !rounded-md w-24 object-contain p-1 shrink-0" />
                                    <div class="flex flex-col gap-0.5">
                                        <div class="flex items-center gap-1.5">
                                            <span class="truncate 2xl:max-w-64 max-w-44">{{ row.name }}</span>
                                            <Icon v-if="row.currentNetworkStatus.fpp" name="solar:shield-star-bold" class="size-5 text-success" />
                                        </div>
                                        <div class="flex items-center text-xs whitespace-nowrap">
                                            <NuxtImg :src="row.country.imageUrl" class="h-4 !rounded-sm w-6 object-cover shrink-0 mr-1.5" />
                                            <div class="opacity-75 font-semibold">{{ row.country.name }}</div>
                                            <span class="capitalize font-light opacity-80">, {{ row.city.toLowerCase() }}</span>
                                        </div>
                                        <div class="hover:text-warning transition-colors cursor-pointer text-xs opacity-75 mt-0.5 lowercase" @click="useClipboard(row.email.toLowerCase())">
                                            <span class="truncate 2xl:max-w-64 max-w-44">{{ row.email.toLowerCase() }}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <div>
                                        <UiCompanyTypeBadge v-if="row.typeCompany" :data="row.typeCompany" />
                                        <span v-else>---</span>
                                    </div>
                                    <div class="mt-2 font-medium flex items-center gap-1">
                                        <icon name="solar:hashtag-bold-duotone" class="size-4 opacity-50" />
                                        <span class="text-sm opacity-75">{{ row.wsaId }}</span>
                                    </div>
                                </div>
                            </td>
                            <td v-if="!serverParams.deleted">
                                <template v-if="row.currentNetworkStatus">
                                    <div class="flex items-center gap-1.5">
                                        <UiNetworkTypeBadge :data="row.currentNetworkStatus.type" />
                                        <UiStatusBadge v-if="row.currentNetworkStatus.status !== 'approved'" :data="row.currentNetworkStatus.status" />
                                        <UiActiveBadge v-if="!row.currentNetworkStatus.active" :data="row.currentNetworkStatus.active" />
                                    </div>
                                </template>
                            </td>
                            <td v-if="serverParams.deleted" class="text-sm">{{ row.deletedAt }}</td>
                            <td v-if="!serverParams.deleted" class="text-right">
                                <div>
                                    <NuxtLink :to="'/members-data/members/' + row.id">
                                        <button :disabled="serverParams.deleted" class="btn btn-secondary btn-rounded btn-sm gap-3">
                                            <Icon name="solar:eye-outline" class="size-4" />
                                            View
                                        </button>
                                    </NuxtLink>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr v-for="i in serverParams.perPage" :key="i">
                            <td colspan="5">
                                <div class="h-12 !opacity-50 animate-pulse" />
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <!-- Pagination -->
        <TablePagination :pending="status === 'pending'" :rows="rows" :page="serverParams.page" @change-page="changePage" />
    </div>
</template>
