<script setup>
definePageMeta({
    middleware: 'auth',
});
const selectedRows = ref([]);
const sortByList = ref([
    { name: 'Sort By ID', value: 'id' },
    { name: 'Sort By Name', value: 'name' },
    { name: 'Sort By City', value: 'city' },
    { name: 'Sort By Country', value: 'country_id' },
]);
const filter = ref({
    uuid: null,
});
const membershipTypes = ref([
    { name: 'Member', value: 'member' },
    { name: 'Founder', value: 'founder' },
    { name: 'Partner', value: 'partner' },
    { name: 'Vendor', value: 'vendor' },
    { name: 'Non Member', value: 'non_member' },
    { name: 'WSA Team', value: 'wsa_team' },
]);
const orderStatuses = ref([
    { name: 'Application Form', value: 'in_application_form' },
    { name: 'Pending Payment', value: 'pending_payment' },
    { name: 'Pending Bank Transfer', value: 'pending_bank_transfer' },
    { name: 'Approved Online Payment', value: 'approved_online_payment' },
    { name: 'Approved Bank Transfer', value: 'approved_bank_transfer' },
]);
const serverParams = ref({
    filters: {},
    relationFilter: {
        orderStatus: [],
        memberType: [],
        sponsorshipItemName: null,
        packageName: null,
    },
    orderBy: 'id',
    orderByDirection: 'asc',
    perPage: 10,
    page: 1,
    paginate: true,
});
const showFilter = ref(false);

function toggleShowMoreFilterOptions() {
    showFilter.value = !showFilter.value;
}
const resetServerParams = async () => {
    filter.value = {
        uuid: null,
    };
    serverParams.value = {
        filters: {},
        relationFilter: {
            memberType: [],
            orderStatus: [],
            sponsorshipItemName: null,
            packageName: null,
        },
        orderBy: 'id',
        orderByDirection: 'asc',
        perPage: 10,
        page: 1,
        paginate: true,
    };
    selectedRows.value = [];
    await refresh();
};
const {
    data: rows,
    pending,
    refresh,
} = await useApiFetch('/api/dashboard/order/index', {
    method: 'POST',
    body: serverParams,
    lazy: true,
});
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

async function deleteItems(id) {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if (confirmed) {
        const { data, error } = await useApiFetch(`/api/dashboard/order/${id}/delete`, {
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

const conferenceInfoBoxes = ref([]);
const { data: conferenceStatistics, execute: fetchConferenceStatistics } = await useApiFetch('/api/event/dashboard/report', {
    immediate: false,
    lazy: true,
});

async function prepareInfoBoxes() {
    await fetchConferenceStatistics();
    conferenceInfoBoxes.value = [
        {
            title: 'Approved Payments',
            icon: 'solar:dollar-minimalistic-outline',
            value: useFormatCurrency(conferenceStatistics.value.totalAmount),
            description: 'USD',
        },
        {
            title: 'Approved Companies',
            icon: 'solar:case-minimalistic-line-duotone',
            value: conferenceStatistics.value.totalApprovedCompanies,
            description: 'Companies',
        },
        {
            title: 'Approved Delegates',
            icon: 'solar:users-group-two-rounded-linear',
            value: conferenceStatistics.value.totalApprovedDelegates,
            description: 'Delegate',
        },
        {
            title: 'Booked Rooms',
            icon: 'solar:bed-line-duotone',
            value: conferenceStatistics.value.totalBookedRooms,
            description: 'Room',
        },
    ];
}

onMounted(() => {
    prepareInfoBoxes();
});

async function refreshFilterData() {
    serverParams.value.page = 1;
    await refresh();
}
</script>
<template>
    <div v-if="usePermissionCheck(['conference_order_list'])" class="flex flex-col gap-8">
        <!-- Page Title & Action Buttons -->
        <div class="md:flex md:items-center md:justify-between md:gap-5">
            <div class="flex items-center gap-2">
                <Icon name="solar:clipboard-list-linear" class="size-5 opacity-75" />
                <div>Orders</div>
            </div>
        </div>
        <!-- Network Members Statistics -->
        <UiInfoBox :data="conferenceInfoBoxes" />
        <!-- Filter & Search -->
        <div class="grid lg:grid-cols-12 gap-5 items-center p-5 bg-white border rounded-2xl">
            <FormInputField v-model="filter.uuid" rounded class="xl:col-span-4 lg:col-span-4" placeholder="Order UUID/Code" />
            <FormInputField v-model="serverParams.relationFilter.sponsorshipItemName" rounded class="xl:col-span-4 lg:col-span-4" placeholder="Sponsorship Item Name" />
            <FormInputField v-model="serverParams.relationFilter.packageName" rounded class="xl:col-span-4 lg:col-span-4" placeholder="Package Name" />
            <TransitionExpand>
                <div v-if="showFilter" class="lg:col-span-12 grid lg:grid-cols-12 gap-5 items-center">
                    <div class="lg:col-span-12">
                        <div class="border border-slate-100 bg-slate-50/50 rounded-lg grid grid-cols-12 p-5 gap-5">
                            <div class="sm:col-span-12">
                                <fieldset class="px-5 grid lg:grid-cols-3 sm:grid-cols-2 gap-5 grid-cols-1 duration-300 ease-in-out">
                                    <div v-for="option in membershipTypes" :key="option.value" class="relative flex items-start">
                                        <div class="flex items-center h-6">
                                            <input
                                                :id="option.value"
                                                v-model="serverParams.relationFilter.memberType"
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
                                                :class="[serverParams.relationFilter.memberType.includes(option.value) ? ' font-medium opacity-75' : 'font-light']"
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
                                    <div v-for="option in orderStatuses" :key="option.value" class="relative flex items-start">
                                        <div class="flex items-center h-6">
                                            <input
                                                :id="option.value"
                                                v-model="serverParams.relationFilter.orderStatus"
                                                :checked="orderStatuses.includes(option.value)"
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
                                                :class="[serverParams.relationFilter.orderStatus.includes(option.value) ? ' font-medium opacity-75' : 'font-light']"
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
            <button class="xl:col-span-4 lg:col-span-4 btn btn-rounded btn-sm btn-primary gap-3 w-full" @click="refreshFilterData">
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
                        <th>Order</th>
                        <th>Company</th>
                        <th>Amount</th>
                        <th>Items</th>
                        <th class="text-center">Package</th>
                        <th class="text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="!pending && rows">
                        <tr v-for="row in rows.data" :key="row.id" class="text-sm">
                            <td class="whitespace-nowrap">
                                <div class="font-medium">{{ row.uuid }}</div>
                                <div class="font-light text-xs mt-0.5">{{ row.createdAt }}</div>
                                <div class="mt-1.5 text-xs">
                                    <UiEventOrderStatusBadge :data="row.status" />
                                </div>
                            </td>
                            <td class="text-sm font-normal whitespace-nowrap">
                                <div v-if="row.user" class="flex items-start gap-3">
                                    <NuxtImg v-if="row.user?.imageUrl" :src="row.user?.imageUrl" class="h-10 !rounded-md w-16 object-contain p-1 shrink-0" />
                                    <div class="flex flex-col gap-0.5">
                                        <div class="flex items-center gap-1.5">
                                            <span class="truncate 2xl:max-w-64 max-w-36">{{ row.user?.name }}</span>
                                        </div>
                                        <div class="flex items-center text-xs whitespace-nowrap max-w-36">
                                            <NuxtImg v-if="row.user?.imageUrl" :src="row.user.countryFlag" class="h-4 !rounded-sm w-6 object-cover shrink-0 mr-1.5" />
                                            <div class="text-xs opacity-75 font-semibold truncate">{{ row.user?.countryName }}</div>
                                        </div>
                                        <span class="capitalize text-xs font-light opacity-80 truncate">{{ row.user?.city.toLowerCase() }}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="font-medium">$ {{ row.amount }}</div>
                            </td>
                            <td>
                                <div v-if="row.sponsorshipItems.length > 0" class="flex items-center -space-x-4">
                                    <template v-for="item in row.sponsorshipItems" :key="item.id">
                                        <NuxtImg v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" :title="item.name" class="bg-primary size-10 !rounded-full p-1" />
                                    </template>
                                </div>
                                <div v-else>---</div>
                            </td>
                            <td>
                                <div v-if="row.package" class="text-xs font-normal text-center">{{ row.package?.name }}</div>
                                <div v-else>---</div>
                            </td>
                            <td class="text-right">
                                <div class="flex items-center gap-3">
                                    <NuxtLink :to="'/conferences-attendees/orders/' + row.id">
                                        <div class="p-1.5 bg-slate-100 !rounded-md text-slate-500 hover:scale-[103%] transition-all cursor-pointer">
                                            <Icon name="solar:eye-outline" class="size-5" />
                                        </div>
                                    </NuxtLink>
                                    <div v-if="usePermissionCheck(['conference_order_delete'])" class="p-1.5 bg-slate-100 !rounded-md text-danger hover:scale-[103%] transition-all cursor-pointer" @click="deleteItems(row.id)">
                                        <Icon name="solar:trash-bin-minimalistic-linear" class="size-5" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr v-for="i in serverParams.perPage" :key="i">
                            <td colspan="7">
                                <div class="h-12 !opacity-50 animate-pulse" />
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <!-- Pagination -->
        <TablePagination :pending="pending" :rows="rows" :page="serverParams.page" @change-page="changePage" />
    </div>
</template>
