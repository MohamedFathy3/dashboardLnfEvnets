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
    email: null,
});

const serverParams = ref({
    filters: {},
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
    status,
    refresh,
} = await useApiFetch('/api/contact-person/index', {
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

async function deleteItems() {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if (confirmed) {
        const { data, error } = await useApiFetch(`/api/contact-person/delete`, {
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
        const { data, error } = await useApiFetch(`/api/contact-person/force-delete`, {
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
        const { data, error } = await useApiFetch(`/api/contact-person/restore`, {
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
</script>
<template>
    <div v-if="usePermissionCheck(['network_contact_person_list'])" class="flex flex-col gap-8">
        <!-- Page Title & Action Buttons -->
        <div class="md:flex md:items-center md:justify-between md:gap-5">
            <div class="flex items-center gap-2">
                <Icon name="solar:users-group-two-rounded-line-duotone" class="size-5 opacity-75" />
                <div>{{ serverParams.deleted ? 'Deleted Contact Persons' : 'Contact Persons' }}</div>
            </div>
            <div class="md:flex md:items-center md:gap-5 md:space-y-0 space-y-5">
                <template v-if="selectedRows.length > 0">
                    <template v-if="serverParams.deleted">
                        <button v-if="usePermissionCheck(['network_contact_person_force_delete'])" class="btn btn-danger btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="forceDeleteItems">
                            <Icon name="solar:trash-bin-minimalistic-line-duotone" class="size-5 opacity-75" />
                            Delete Permanently
                        </button>
                    </template>
                    <template v-else>
                        <button v-if="usePermissionCheck(['network_contact_person_delete'])" class="btn btn-danger btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="deleteItems">
                            <Icon name="solar:trash-bin-minimalistic-line-duotone" class="size-5 opacity-75" />
                            Delete Items
                        </button>
                    </template>
                    <template v-if="serverParams.deleted">
                        <button v-if="usePermissionCheck(['network_contact_person_restore'])" class="btn btn-success btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="restoreItems">
                            <Icon name="solar:restart-circle-outline" class="size-5 opacity-75" />
                            Restore Items
                        </button>
                    </template>
                </template>
                <!--                <button v-if="usePermissionCheck(['network_contact_person_create'])" :disabled="serverParams.deleted" class="btn btn-primary btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="openModal()">-->
                <!--                    <Icon name="solar:add-square-linear" class="size-5 opacity-75" />-->
                <!--                    Add New-->
                <!--                </button>-->
                <button
                    v-if="usePermissionCheck(['network_contact_person_delete', 'network_contact_person_force_delete', 'network_contact_person_restore'])"
                    class="btn btn-primary btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5"
                    @click="toggleDeleted"
                >
                    <Icon :name="serverParams.deleted ? 'solar:hamburger-menu-line-duotone' : 'solar:trash-bin-minimalistic-line-duotone'" class="size-5 opacity-75" />
                    {{ serverParams.deleted ? 'Items List' : 'Deleted Items' }}
                </button>
            </div>
        </div>
        <!-- Filter & Search -->
        <div class="grid lg:grid-cols-12 gap-5 items-center p-5 bg-white border rounded-2xl">
            <FormInputField v-model="filter.name" rounded class="xl:col-span-4 lg:col-span-4" placeholder="Name" />
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
                    <th class="text-left">
                        <input v-model="allSelected" type="checkbox" class="form-check-input" @change="selectAllRows" />
                    </th>
                    <th>Name</th>
                    <th>Company</th>
                    <th v-if="serverParams.deleted">Deleted At</th>
                    <th class="text-right">Action</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="status !== 'pending' && rows">
                    <tr v-for="row in rows.data" :key="row.id" class="text-sm">
                        <td>
                            <input :checked="isSelected(row.id)" type="checkbox" class="form-check-input" @change="toggleRowSelection(row.id)" />
                        </td>
                        <td class="font-normal">
                            <div class="flex items-center gap-3">
                                <NuxtImg :src="row.imageUrl" :alt="row.name" :title="row.name" class="size-10 !rounded-full object-cover" />
                                <div>
                                    <div>{{ row.name }}</div>
                                    <div class="font-light text-sm opacity-75 truncate max-w-[15rem]">{{ row.jobTitle }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="text-sm font-normal whitespace-nowrap">
                            <div class="flex items-center gap-3">
                                <NuxtImg :src="row.company.imageUrl" class="h-10 !rounded-md w-20 object-contain p-1 shrink-0" />
                                <div class="flex flex-col gap-0.5">
                                    <div class="flex items-center gap-1.5">
                                        <span class="truncate 2xl:max-w-64 max-w-44">{{ row.company.name }}</span>
                                    </div>
                                    <div class="flex items-center text-xs whitespace-nowrap">
                                        <NuxtImg :src="row.company.country.imageUrl" class="h-4 !rounded-sm w-6 object-cover shrink-0 mr-1.5" />
                                        <div class="opacity-75 font-semibold">{{ row.company.country.name }}</div>
                                        <span class="capitalize font-light opacity-80">, {{ row.company.city.toLowerCase() }}</span>
                                    </div>
                                </div>
                            </div>
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
        <TablePagination :pending="status === 'pending'" :rows="rows" :page="serverParams.page" @change-page="changePage" />
        <MemberContactPersonModal v-if="isOpen" :open="isOpen" :person-id="selectedId ? selectedId : null" @close="closeModal" @refresh="refresh" />
    </div>
</template>
