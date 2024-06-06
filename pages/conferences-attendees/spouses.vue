<script setup>
definePageMeta({
    middleware: 'auth',
});
const selectedRows = ref([]);
const sortByList = ref([
    { name: 'Sort By ID', value: 'id' },
    { name: 'Sort By Name', value: 'name' },
]);
const filter = ref({
    name: null,
});

const serverParams = ref({
    filters: {},
    relationFilter: {
        memberType: null,
        orderStatus: [],
        companyName: null,
        companyCountryId: null,
    },
    orderBy: 'id',
    orderByDirection: 'desc',
    perPage: 25,
    page: 1,
    paginate: true,
    deleted: false,
});
const formLoading = ref(false);
const isOpen = ref(false);
const resetServerParams = async () => {
    filter.value = {
        name: null,
        email: null,
    };
    serverParams.value = {
        filters: {},
        relationFilter: {
            memberType: null,
            orderStatus: [],
            companyName: null,
            companyCountryId: null,
        },
        orderBy: 'id',
        orderByDirection: 'desc',
        perPage: 25,
        page: 1,
        paginate: true,
        deleted: false,
    };
    selectedRows.value = [];
    await refresh();
};
const {
    data: rows,
    pending,
    refresh,
} = await useApiFetch('/api/dashboard/spouse/index', {
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

const selectedId = ref(null);

async function closeModal() {
    isOpen.value = false;
    selectedId.value = null;
}

async function openModal(id) {
    formLoading.value = true;
    if (id) {
        selectedId.value = id;
    }
    isOpen.value = true;
    formLoading.value = false;
}
const resources = useResourceStore();
</script>
<template>
    <div class="flex flex-col gap-8">
        <!-- Page Title & Action Buttons -->
        <div class="md:flex md:items-center md:justify-between md:gap-5">
            <div class="flex items-center gap-2">
                <Icon name="solar:users-group-two-rounded-line-duotone" class="size-5 opacity-75" />
                <div>Delegates</div>
            </div>
        </div>
        <!-- Filter & Search -->
        <div class="grid lg:grid-cols-12 gap-5 items-center p-5 bg-white border rounded-2xl">
            <FormInputField v-model="filter.name" rounded class="xl:col-span-4 lg:col-span-4" placeholder="Name" />
            <FormInputField v-model="filter.email" rounded class="xl:col-span-4 lg:col-span-4" placeholder="Email" />
            <FormInputField v-model="serverParams.relationFilter.companyName" rounded class="xl:col-span-4 lg:col-span-4" placeholder="Company" />
            <FormSelectField
                id="get-members-by-country-form"
                v-model="serverParams.relationFilter.companyCountryId"
                class="lg:col-span-4 xl:col-span-4"
                placeholder="Please select a country..."
                :select-data="resources.countries"
                labelvalue="name"
                keyvalue="id"
                imgvalue="imageUrl"
            />
            <FormSelectField v-model="serverParams.orderBy" :clearable="false" class="xl:col-span-4 lg:col-span-4" labelvalue="name" keyvalue="value" placeholder="Sort Direction" :select-data="sortByList" />
            <FormSelectField
                v-model="serverParams.orderByDirection"
                class="xl:col-span-4 lg:col-span-4"
                :clearable="false"
                labelvalue="name"
                keyvalue="value"
                placeholder="Sort Direction"
                :select-data="[
                    { name: 'Z : A', value: 'desc' },
                    { name: 'A : Z', value: 'asc' },
                ]"
            />
            <button class="xl:col-span-6 lg:col-span-6 btn btn-rounded btn-sm btn-primary gap-3 w-full" @click="refresh">
                <Icon name="solar:rounded-magnifer-line-duotone" class="size-5 shrink-0" />
                Filter
            </button>
            <button class="xl:col-span-6 lg:col-span-6 btn btn-rounded btn-sm btn-secondary gap-3 w-full" @click="resetServerParams">
                <Icon name="solar:restart-circle-outline" class="size-5 shrink-0" />
                Reset
            </button>
        </div>
        <!-- Table -->
        <table class="table table-report font-light">
            <thead>
                <tr class="uppercase text-sm">
                    <th>Delegate</th>
                    <th>Company</th>
                    <th>Membership</th>
                    <th>Order Status</th>
                    <th v-if="serverParams.deleted">Deleted At</th>
                    <th class="text-right">Action</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="!pending && rows">
                    <tr v-for="row in rows.data" :key="row.id" class="text-sm">
                        <td class="font-normal">
                            <div class="flex items-center gap-3">
                                <NuxtImg :src="row.imageUrl" :alt="row.name" :title="row.name" class="size-14 !rounded-full object-cover" />
                                <div>
                                    <div>{{ row.name }}</div>
                                    <div class="font-normal mt-0.5 text-xs opacity-75 capitalize">{{ row.type }}</div>
                                    <div class="font-light mt-0.5 text-xs opacity-75 truncate max-w-[15rem]">{{ row.delegate }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="text-sm font-normal whitespace-nowrap">
                            <div class="flex items-center gap-3">
                                <NuxtImg :src="row.company.imageUrl" class="h-12 !rounded-md w-20 object-contain p-1 shrink-0" />
                                <div class="flex flex-col gap-0.5">
                                    <div class="flex items-center gap-1.5">
                                        <span class="truncate 2xl:max-w-64 max-w-44">{{ row.company.name }}</span>
                                    </div>
                                    <div class="flex items-center text-xs whitespace-nowrap">
                                        <NuxtImg :src="row.company.countryFlag" class="h-4 !rounded-sm w-6 object-cover shrink-0 mr-1.5" />
                                        <div class="opacity-75 font-semibold">{{ row.company.countryName }}</div>
                                        <span class="capitalize font-light opacity-80">, {{ row.company.city.toLowerCase() }}</span>
                                    </div>
                                    <div class="font-light mt-0.5 text-xs opacity-75 truncate max-w-[15rem]">{{ row.company.email }}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <UiNetworkTypeBadge :data="row.company.membershipType" />
                        </td>
                        <td>
                            <UiEventOrderStatusBadge :data="row.orderStatus" />
                        </td>
                        <td v-if="serverParams.deleted" class="text-sm">{{ row.deletedAt }}</td>
                        <td class="text-right">
                            <div>
                                <button :disabled="serverParams.deleted" class="btn btn-secondary btn-rounded btn-sm gap-3" @click="openModal(row.id)">
                                    <Icon name="solar:pen-new-round-outline" class="size-4" />
                                    Edit
                                </button>
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
        <!-- Pagination -->
        <TablePagination :pending="pending" :rows="rows" :page="serverParams.page" @change-page="changePage" />
        <MemberSpouseModal v-if="isOpen" :open="isOpen" :person-id="selectedId" @close="closeModal" @refresh="refresh" />
    </div>
</template>
