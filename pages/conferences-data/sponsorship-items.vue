<script setup>
import { numeric, required, requiredIf } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

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
    orderBy: 'id',
    orderByDirection: 'asc',
    perPage: 25,
    page: 1,
    paginate: true,
    deleted: false,
});
const formLoading = ref(false);
const isOpen = ref(false);
const editMode = ref(false);
const resetServerParams = async () => {
    filter.value = {
        name: null,
    };
    serverParams.value = {
        filters: {},
        orderBy: 'id',
        orderByDirection: 'asc',
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
} = await useApiFetch('/api/sponsorship-item/index', {
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
const item = ref({
    name: null,
    description: null,
    shortDescription: null,
    count: null,
    isInfinity: true,
    active: true,
    image: null,
    price: 0,
    earlybirdPrice: 0,
    isFeatured: false,
    features: [],
    orderId: null,
});
const rules = ref({
    name: { required },
    description: {},
    shortDescription: {},
    count: { required: requiredIf(() => item.value.isInfinity) },
    isInfinity: {},
    orderId: { numeric, required },
    isFeatured: {},
    active: {},
    image: {},
    earlybirdPrice: {},
    price: { numeric, required },
    features: {},
});
const v$ = useVuelidate(rules, item);
const fetchItem = async (id) => {
    const { data, error } = await useApiFetch(`/api/sponsorship-item/${id}`, {
        lazy: true,
    });
    if (data.value) {
        item.value = data.value.data;
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
};
const resetItemValues = async () => {
    item.value = {
        name: null,
        description: null,
        shortDescription: null,
        count: null,
        isInfinity: true,
        active: true,
        image: null,
        price: 0,
        earlybirdPrice: 0,
        isFeatured: false,
        features: [],
        orderId: null,
    };
};
async function closeModal() {
    isOpen.value = false;
    editMode.value = false;
    v$.value.$reset();
    await resetItemValues();
}
async function openModal(id = null) {
    formLoading.value = true;
    if (id !== null) {
        editMode.value = true;
        await fetchItem(id);
    } else {
        editMode.value = false;
    }
    formLoading.value = false;
    isOpen.value = true;
}

async function updateItem() {
    const { data, error } = await useApiFetch(`/api/sponsorship-item/${item.value?.id}`, {
        method: 'PATCH',
        body: item,
        lazy: true,
    });
    if (data.value) {
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
        await closeModal();
        await refresh();
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
}

async function addItem() {
    const { data, error } = await useApiFetch(`/api/sponsorship-item`, {
        method: 'POST',
        body: item,
        lazy: true,
    });
    if (data.value) {
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
        await closeModal();
        await refresh();
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
}

async function handleModalSubmit() {
    formLoading.value = true;
    const result = await v$.value.$validate();
    if (!result) {
        formLoading.value = false;
        return false;
    }
    if (editMode.value === true) {
        await updateItem();
    } else {
        await addItem();
    }
}

async function deleteItems() {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if (confirmed) {
        const { data, error } = await useApiFetch(`/api/sponsorship-item/delete`, {
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
        const { data, error } = await useApiFetch(`/api/sponsorship-item/force-delete`, {
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
        const { data, error } = await useApiFetch(`/api/sponsorship-item/restore`, {
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

const addFeatureRow = () => {
    item.value.features.push({
        name: null,
        active: true,
    });
};
const removeFeatureRow = (index) => {
    item.value.features.splice(index, 1);
};
</script>
<template>
    <div class="flex flex-col gap-8">
        <!-- Page Title & Action Buttons -->
        <div class="md:flex md:items-center md:justify-between md:gap-5">
            <div class="flex items-center gap-2">
                <Icon name="solar:asteroid-linear" class="size-5 opacity-75" />
                <div>{{ serverParams.deleted ? 'Deleted Sponsorship Items' : 'Sponsorship Items' }}</div>
            </div>
            <div class="md:flex md:items-center md:gap-5 md:space-y-0 space-y-5">
                <template v-if="selectedRows.length > 0">
                    <button v-if="serverParams.deleted" class="btn btn-danger btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="forceDeleteItems">
                        <Icon name="solar:trash-bin-minimalistic-line-duotone" class="size-5 opacity-75" />
                        Delete Permanently
                    </button>
                    <button v-else class="btn btn-danger btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="deleteItems">
                        <Icon name="solar:trash-bin-minimalistic-line-duotone" class="size-5 opacity-75" />
                        Delete Items
                    </button>
                    <button v-if="serverParams.deleted" class="btn btn-success btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="restoreItems">
                        <Icon name="solar:restart-circle-outline" class="size-5 opacity-75" />
                        Restore Items
                    </button>
                </template>
                <button :disabled="serverParams.deleted" class="btn btn-primary btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="openModal()">
                    <Icon name="solar:add-square-linear" class="size-5 opacity-75" />
                    Add New
                </button>
                <button class="btn btn-primary btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="toggleDeleted">
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
                    <th class="text-left">Name</th>
                    <th>Availability</th>
                    <th>Active</th>
                    <th v-if="serverParams.deleted" class="whitespace-nowrap">Deleted At</th>
                    <th class="text-right">Action</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="!pending && rows">
                    <tr v-for="row in rows.data" :key="row.id" class="text-sm">
                        <td>
                            <input :checked="isSelected(row.id)" type="checkbox" class="form-check-input" @change="toggleRowSelection(row.id)" />
                        </td>
                        <td class="font-normal">
                            <div class="flex items-center gap-3">
                                <NuxtImg :src="row.imageUrl" :alt="row.name" :title="row.name" class="w-10 h-10 bg-primary p-1 object-contain ring-1 ring-slate-500/25 !rounded-md" />
                                <div>
                                    <div class="font-normal line-clamp-1">{{ row.name }}</div>
                                    <div class="font-light flex items-center gap-1.5 mt-0.5">
                                        <span class="font-medium">{{ row.price }}</span>
                                        <span>USD</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="font-normal">
                            <div v-if="row.isInfinity" class="text-success">Unlimited</div>
                            <template v-else>
                                <div>Count: {{ row.count }}</div>
                                <div>
                                    <div v-if="row.available" class="text-success">Available: {{ row.availableCount }}</div>
                                    <div v-else class="text-danger mt-0.5">Fully Booked</div>
                                </div>
                            </template>
                        </td>
                        <td>
                            <FormSwitch :id="'row-active-' + row.id" v-model="row.active" :disabled="serverParams.deleted" @change="useToggleSwitch(row.id, 'active', 'sponsorship-item')" />
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
                        <td colspan="6">
                            <div class="h-12 !opacity-50 animate-pulse" />
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <!-- Pagination -->
        <TablePagination :pending="pending" :rows="rows" :page="serverParams.page" @change-page="changePage" />

        <TheModal :open-modal="isOpen" size="5xl" @close-modal="closeModal()">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="font-medium" v-html="editMode ? 'Update Item' : 'Add New Item'"></div>
                    <Icon class="w-8 h-8 opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300" name="solar:close-square-outline" @click="closeModal" />
                </div>
            </template>
            <template #content>
                <div class="grid lg:grid-cols-12 gap-5 items-start">
                    <div class="lg:col-span-4 space-y-5">
                        <FormUploader v-model="item.image" :errors="v$.image.$errors" label="Cover Image" name="image" :max="1" />
                    </div>
                    <div class="lg:col-span-8 grid grid-cols-12 gap-5">
                        <FormInputField v-model="item.name" :errors="v$.name.$errors" class="col-span-12" label="Name" :name="'name'" placeholder="Name" />
                        <FormInputField v-model="item.description" :errors="v$.description.$errors" class="col-span-12" label="Description" :name="'description'" placeholder="Description" type="textarea" />
                        <FormInputField v-model="item.shortDescription" :errors="v$.shortDescription.$errors" class="col-span-12" label="Short Description" :name="'short-description'" placeholder="Short Description" type="textarea" />
                        <div class="lg:col-span-12 pt-5 border-t border-dashed mt-3">
                            <div class="form-label opacity-75">Sponsorship Item Features</div>
                            <div class="bg-white rounded-xl border p-5 mt-2">
                                <div class="space-y-4">
                                    <div v-for="(feature, index) in item.features" :key="index" class="flex items-center gap-5">
                                        <FormInputField v-model="feature.name" class="grow" :name="'feature-name-' + index" placeholder="Feature Name" />
                                        <FormSwitch
                                            v-model="feature.active"
                                            :name="'feature-active-' + index"
                                            :class="[feature.active ? 'text-success' : 'text-danger', 'col-span-12 sm:col-span-5']"
                                            :flex-title="true"
                                            :label="feature.active ? 'Active' : 'Inactive'"
                                        />
                                        <div class="col-span-12 sm:col-span-2">
                                            <button type="button" class="btn btn-outline-danger btn-sm btn-rounded" @click="removeFeatureRow(index)">
                                                <Icon name="solar:close-circle-outline" class="size-4 mr-2" />
                                                <span>Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-secondary btn-sm w-full btn-rounded" @click="addFeatureRow">
                                        <Icon name="solar:add-circle-outline" class="size-4 mr-2" />
                                        <span>Add New</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <FormInputField v-model="item.price" :errors="v$.price.$errors" class="col-span-12 sm:col-span-6" label="Price" :name="'price'" placeholder="Price" type="number" />
                        <FormInputField v-model="item.earlybirdPrice" :errors="v$.earlybirdPrice.$errors" class="col-span-12 sm:col-span-6" label="Early Bird price" :name="'earlybird-price'" placeholder="Early Bird price" type="number" />
                        <FormInputField v-model="item.count" :disabled="item.isInfinity" :errors="v$.count.$errors" class="col-span-12 sm:col-span-6" label="Count" :name="'count'" placeholder="Count" type="number" />
                        <FormSwitch v-model="item.isInfinity" :name="'is-infinity'" :errors="v$.isInfinity.$errors" class="col-span-12 sm:col-span-6" label="Unlimited" />
                        <FormSwitch v-model="item.isFeatured" :name="'is-infinity'" :errors="v$.isFeatured.$errors" class="col-span-12 sm:col-span-6" label="Featured Item (VIP table)" />
                        <FormInputField v-model="item.orderId" type="number" :errors="v$.orderId.$errors" class="col-span-12 sm:col-span-6" label="Position" :name="'order'" placeholder="Position" />
                        <FormSwitch v-model="item.active" :name="'active'" :errors="v$.active.$errors" class="col-span-12 sm:col-span-6" label="Active" />
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="w-full flex items-center justify-end gap-5">
                    <button :disabled="formLoading" class="btn-rounded btn-sm btn btn-danger px-4" type="button" @click="closeModal">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:close-circle-linear'" class="w-5 h-5 mr-2" />
                        <span>Close</span>
                    </button>
                    <button :disabled="formLoading" class="btn-rounded btn-sm btn btn-primary px-4" type="button" @click="handleModalSubmit()">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:check-circle-broken'" class="w-5 h-5 mr-2" />
                        <span v-html="editMode ? 'Update' : 'Save'" />
                    </button>
                </div>
            </template>
        </TheModal>
    </div>
</template>
