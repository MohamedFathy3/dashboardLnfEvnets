<script setup>
import { numeric, required } from '@vuelidate/validators';
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
const buttonTypes = ref([
    { value: 'primary', name: 'Primary' },
    { value: 'secondary', name: 'Light Gray' },
    { value: 'dark', name: 'Dark' },
    { value: 'success', name: 'Green' },
    { value: 'warning', name: 'Orange' },
    { value: 'danger', name: 'Red' },
]);
const linkType = ref([
    { value: 0, name: 'Use Normal Link (External)' },
    { value: 1, name: 'Use Router Link (Internal)' },
]);
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
const editMode = ref(false);
const resetServerParams = async () => {
    filter.value = {
        name: null,
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
    pending,
    refresh,
} = await useApiFetch('/api/slider/index', {
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
    subTitle: null,
    des: null,
    orderId: null,
    networkId: null,
    image: null,
    active: true,
    title: null,
    bgUrl: null,
    linkType: true,
    buttonOneActive: false,
    buttonTextOne: null,
    buttonStyleOne: 'primary',
    buttonRouteOne: null,
    buttonIconOne: null,
    buttonLinkTypeOne: 0,
    buttonTwoActive: false,
    buttonTextTwo: null,
    buttonStyleTwo: 'primary',
    buttonRouteTwo: null,
    buttonIconTwo: null,
    buttonLinkTypeTwo: 0,
});
const rules = ref({
    title: { required },
    name: {},
    bgUrl: {},
    linkType: {},
    subTitle: {},
    des: {},

    buttonOneActive: {},
    buttonTextOne: { required: item.value.buttonOneActive ? required : {} },
    buttonStyleOne: { required: item.value.buttonOneActive ? required : {} },
    buttonRouteOne: { required: item.value.buttonOneActive ? required : {} },
    buttonIconOne: {},
    buttonLinkTypeOne: { required: item.value.buttonOneActive ? required : {} },

    buttonTwoActive: {},
    buttonTextTwo: { required: item.value.buttonTwoActive ? required : {} },
    buttonStyleTwo: { required: item.value.buttonTwoActive ? required : {} },
    buttonRouteTwo: { required: item.value.buttonTwoActive ? required : {} },
    buttonIconTwo: {},
    buttonLinkTypeTwo: { required: item.value.buttonTwoActive ? required : {} },

    image: { required },
    active: {},
    orderId: { numeric },
});
const v$ = useVuelidate(rules, item);
const fetchItem = async (id) => {
    const { data, error } = await useApiFetch(`/api/slider/${id}`, {
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
        subTitle: null,
        des: null,
        orderId: null,
        networkId: null,
        image: null,
        active: true,
        title: null,
        bgUrl: null,
        linkType: true,
        buttonOneActive: false,
        buttonTextOne: null,
        buttonStyleOne: null,
        buttonRouteOne: null,
        buttonIconOne: null,
        buttonLinkTypeOne: 0,
        buttonTwoActive: false,
        buttonTextTwo: null,
        buttonStyleTwo: null,
        buttonRouteTwo: null,
        buttonIconTwo: null,
        buttonLinkTypeTwo: 0,
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
    const { data, error } = await useApiFetch(`/api/slider/${item.value.id}`, {
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
    const { data, error } = await useApiFetch(`/api/slider`, {
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
        const { data, error } = await useApiFetch(`/api/slider/delete`, {
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
        const { data, error } = await useApiFetch(`/api/slider/force-delete`, {
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
        const { data, error } = await useApiFetch(`/api/slider/restore`, {
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
    <div class="flex flex-col gap-8">
        <!-- Page Title & Action Buttons -->
        <div class="md:flex md:items-center md:justify-between md:gap-5">
            <div class="flex items-center gap-2">
                <Icon name="solar:asteroid-linear" class="size-5 opacity-75" />
                <div>{{ serverParams.deleted ? 'Deleted Sliders' : 'Sliders' }}</div>
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
                    <th class="text-center">Active</th>
                    <th v-if="serverParams.deleted">Deleted At</th>
                    <th class="text-right">Action</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="!pending && rows">
                    <tr v-for="row in rows.data" :key="row.id">
                        <td>
                            <input :checked="isSelected(row.id)" type="checkbox" class="form-check-input" @change="toggleRowSelection(row.id)" />
                        </td>
                        <td>
                            <div class="flex items-center gap-3">
                                <template v-if="row.image">
                                    <div v-if="row.image.mimeType === 'video/mp4'" class="h-10 !rounded-md w-20 object-cover shrink-0 p-2 flex items-center place-content-center bg-slate-50 border hover:scale-105 ease-in-out duration-300">
                                        <Icon name="ph:film-slate-light" class="w-8 h-8 opacity-50" />
                                    </div>
                                    <NuxtImg v-else :src="row.imageUrl" :title="row.title" :alt="row.title" class="h-10 !rounded-md w-20 object-cover shrink-0" />
                                </template>
                                <div>
                                    <div class="text-sm">{{ row.title }}</div>
                                    <div class="mt-0.5 font-light text-xs opacity-75">{{ row.bgUrl }}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <FormSwitch :id="'row-active-' + row.id" v-model="row.active" :disabled="serverParams.deleted" @change="useToggleSwitch(row.id, 'active', 'slider')" />
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
        <TheModal :open-modal="isOpen" size="5xl" @close-modal="closeModal()">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="font-medium" v-html="editMode ? 'Update Item' : 'Add New Item'"></div>
                    <Icon class="w-8 h-8 opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300" name="solar:close-square-outline" @click="closeModal" />
                </div>
            </template>
            <template #content>
                <div class="grid lg:grid-cols-12 gap-5 items-start">
                    <div class="lg:col-span-4">
                        <FormUploader v-model="item.image" :errors="v$.image.$errors" :allowed-types="['image']" label="Image" name="image" />
                    </div>
                    <div class="lg:col-span-8 grid lg:grid-cols-12 gap-5 items-start">
                        <FormInputField v-model="item.name" :errors="v$.name.$errors" class="lg:col-span-12" label="Name" name="name" placeholder="Name" />
                        <FormInputField v-model="item.title" :errors="v$.title.$errors" class="lg:col-span-12" label="Title" name="title" placeholder="Title" />
                        <FormInputField v-model="item.subTitle" :errors="v$.subTitle.$errors" class="lg:col-span-12" label="Sub Title" name="sub-title" placeholder="Sub Title" />
                        <FormInputField v-model="item.des" :errors="v$.des.$errors" class="lg:col-span-12" label="Description" name="des" placeholder="Description" type="textarea" />

                        <FormInputField v-model="item.orderId" :errors="v$.orderId.$errors" class="lg:col-span-8" label="Order" name="order-id" placeholder="Order Number" type="number" />
                        <FormSwitch v-model="item.active" label="Active" class="lg:col-span-4" name="form-item-active" />

                        <FormInputField v-model="item.bgUrl" :errors="v$.bgUrl.$errors" class="lg:col-span-8" label="Background Link" name="bgUrl" placeholder="Background Link" />
                        <FormSwitch v-model="item.linkType" :errors="v$.linkType.$errors" class="lg:col-span-4" :label="item.linkType ? 'Internal' : 'External'" name="link-type-input" />

                        <FormSwitch v-model="item.buttonOneActive" label="Button One Active" class="col-span-12 sm:col-span-6" name="button-one-active-switch" />
                        <FormSwitch v-model="item.buttonTwoActive" label="Button Two Active" class="col-span-12 sm:col-span-6" name="button-two-active-switch" />
                        <!-- Button #1 -->
                        <TransitionExpand>
                            <div v-if="item.buttonOneActive" class="lg:col-span-12 grid grid-cols-12 gap-5">
                                <div class="col-span-12 mt-2 py-2 bg-slate-100 rounded-md pl-4">
                                    <h1 class="font-semibold">Button One</h1>
                                    <p class="text-xs">Leave all fields empty to disable</p>
                                </div>
                                <FormInputField v-model="item.buttonTextOne" :errors="v$.buttonTextOne.$errors" label="Button text" placeholder="Button text" class="col-span-12" name="button-text-one" />
                                <FormInputField v-model="item.buttonRouteOne" :errors="v$.buttonRouteOne.$errors" label="Link" placeholder="Link" class="col-span-12 sm:col-span-6" name="button-style-one" />
                                <FormSelectField v-model="item.buttonLinkTypeOne" :errors="v$.buttonLinkTypeOne.$errors" class="lg:col-span-6" label="Link Type" :select-data="linkType" name="button-link-type-one" labelvalue="name" keyvalue="value" />
                                <FormInputField v-model="item.buttonIconOne" :errors="v$.buttonIconOne.$errors" label="Icon" placeholder="Icon" class="col-span-12 sm:col-span-6" name="button-icon-one" />
                                <FormSelectField v-model="item.buttonStyleOne" :errors="v$.buttonStyleOne.$errors" class="lg:col-span-6" label="Style" :select-data="buttonTypes" name="button-style-one" labelvalue="name" keyvalue="value" />
                            </div>
                        </TransitionExpand>
                        <!-- Button #2 -->
                        <TransitionExpand>
                            <div v-if="item.buttonTwoActive" class="lg:col-span-12 grid grid-cols-12 gap-5">
                                <div class="col-span-12 mt-2 py-2 bg-slate-100 rounded-md pl-4">
                                    <h1 class="font-semibold">Button Two</h1>
                                    <p class="text-xs">Leave all fields empty to disable</p>
                                </div>
                                <FormInputField v-model="item.buttonTextTwo" :errors="v$.buttonTextTwo.$errors" label="Button text" placeholder="Button text" class="col-span-12" name="button-text-two" />
                                <FormInputField v-model="item.buttonRouteTwo" :errors="v$.buttonRouteTwo.$errors" label="Link" placeholder="Link" class="col-span-12 sm:col-span-6" name="button-style-two" />
                                <FormSelectField v-model="item.buttonLinkTypeTwo" :errors="v$.buttonLinkTypeTwo.$errors" class="lg:col-span-6" label="Link Type" :select-data="linkType" name="button-link-type-two" labelvalue="name" keyvalue="value" />
                                <FormInputField v-model="item.buttonIconTwo" :errors="v$.buttonIconTwo.$errors" label="Icon" placeholder="Icon" class="col-span-12 sm:col-span-6" name="button-icon-two" />
                                <FormSelectField v-model="item.buttonStyleTwo" :errors="v$.buttonStyleTwo.$errors" class="lg:col-span-6" label="Style" :select-data="buttonTypes" name="button-style-two" labelvalue="name" keyvalue="value" />
                            </div>
                        </TransitionExpand>
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
