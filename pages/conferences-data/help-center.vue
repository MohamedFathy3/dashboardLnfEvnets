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
    status,
    refresh,
} = await useApiFetch('/api/event-help-center/index', {
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
    postTitle: null,
    title: null,
    subTitle: null,
    type: 'item',
    shortDescription: null,
    description: null,
    parentId: null,
    list: [],
    active: true,
    mobile: false,
    orderId: null,
    image: null,
    imageDark: null,
});
const rules = ref({
    postTitle: {},
    title: { required },
    subTitle: {},
    type: {},
    shortDescription: {},
    description: {},
    parentId: { numeric },
    list: {},
    active: {},
    mobile: {},
    orderId: { numeric },
    image: {},
    imageDark: {},
});
const v$ = useVuelidate(rules, item);
const fetchItem = async (id) => {
    const { data, error } = await useApiFetch(`/api/event-help-center/${id}`, {
        lazy: true,
    });
    if (data.value) {
        item.value = data.value.data;
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
};

const addListItemRow = () => {
    item.value.list.push({
        name: null,
        active: true,
    });
};
const removeListItemRow = (index) => {
    item.value.list.splice(index, 1);
};
const resetItemValues = async () => {
    item.value = {
        postTitle: null,
        title: null,
        subTitle: null,
        type: 'item',
        shortDescription: null,
        description: null,
        parentId: null,
        list: [],
        active: true,
        mobile: false,
        orderId: null,
        image: null,
        imageDark: null,
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
    const { data, error } = await useApiFetch(`/api/event-help-center/${item.value?.id}`, {
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
    const { data, error } = await useApiFetch(`/api/event-help-center`, {
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
        const { data, error } = await useApiFetch(`/api/event-help-center/delete`, {
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
        const { data, error } = await useApiFetch(`/api/event-help-center/force-delete`, {
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
        const { data, error } = await useApiFetch(`/api/event-help-center/restore`, {
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

const faqTypes = ref([
    { id: 'section', name: 'Section' },
    { id: 'item', name: 'Item' },
]);
</script>
<template>
    <div v-if="usePermissionCheck(['conference_faq_list'])" class="flex flex-col gap-8">
        <!-- Page Title & Action Buttons -->
        <div class="md:flex md:items-center md:justify-between md:gap-5">
            <div class="flex items-center gap-2">
                <Icon name="solar:asteroid-linear" class="size-5 opacity-75" />
                <div>{{ serverParams.deleted ? 'Deleted FAQs' : 'Conference FAQs' }}</div>
            </div>
            <div class="md:flex md:items-center md:gap-5 md:space-y-0 space-y-5">
                <template v-if="selectedRows.length > 0">
                    <template v-if="serverParams.deleted">
                        <button v-if="usePermissionCheck(['conference_faq_force_delete'])" class="btn btn-danger btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="forceDeleteItems">
                            <Icon name="solar:trash-bin-minimalistic-line-duotone" class="size-5 opacity-75" />
                            Delete Permanently
                        </button>
                    </template>
                    <template v-else>
                        <button v-if="usePermissionCheck(['conference_faq_delete'])" class="btn btn-danger btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="deleteItems">
                            <Icon name="solar:trash-bin-minimalistic-line-duotone" class="size-5 opacity-75" />
                            Delete Items
                        </button>
                    </template>
                    <template v-if="serverParams.deleted">
                        <button v-if="usePermissionCheck(['conference_faq_restore'])" class="btn btn-success btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="restoreItems">
                            <Icon name="solar:restart-circle-outline" class="size-5 opacity-75" />
                            Restore Items
                        </button>
                    </template>
                </template>
                <button v-if="usePermissionCheck(['conference_faq_create'])" :disabled="serverParams.deleted" class="btn btn-primary btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="openModal()">
                    <Icon name="solar:add-square-linear" class="size-5 opacity-75" />
                    Add New
                </button>
                <button v-if="usePermissionCheck(['conference_faq_force_delete', 'conference_faq_delete', 'conference_faq_restore'])" class="btn btn-primary btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="toggleDeleted">
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
                    <th>Section</th>
                    <th>Position</th>
                    <th>Active</th>
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
                            <div>{{ row.title }}</div>
                            <div class="font-light text-sm opacity-75 capitalize mt-0.5">{{ row.type }}</div>
                        </td>
                        <td class="font-normal">
                            <div v-if="row.parentId">
                                <span class="px-3 py-1 text-xs font-medium border bg-slate-100 rounded-full">{{ row.parent }}</span>
                            </div>
                            <div v-else>---</div>
                        </td>
                        <td>
                            <div>{{ row.orderId }}</div>
                        </td>
                        <td>
                            <FormSwitch :id="'row-active-' + row.id" v-model="row.active" :disabled="serverParams.deleted || !usePermissionCheck(['conference_faq_update'])" @change="useToggleSwitch(row.id, 'active', 'event-help-center')" />
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
        <TablePagination :pending="status === 'pending'" :rows="rows" :page="serverParams.page" @change-page="changePage" />
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
                        <FormUploader v-model="item.image" :errors="v$.image.$errors" label="Image" :max="1" />
                        <FormUploader v-model="item.imageDark" :errors="v$.imageDark.$errors" label="Image Dark Mode" :max="1" />
                    </div>
                    <div class="lg:col-span-8 grid-cols-12 grid gap-3">
                        <FormInputField v-model="item.postTitle" :errors="v$.postTitle.$errors" class="col-span-12" label="Post Title" name="post-title" placeholder="Post Title" />
                        <FormInputField v-model="item.title" :errors="v$.title.$errors" class="col-span-12" label="Title" :name="'title-' + item.id" placeholder="Title" />
                        <FormInputField v-model="item.subTitle" :errors="v$.subTitle.$errors" class="col-span-12" label="Sub Title" name="sub-title" placeholder="Sub Title" />
                        <FormInputField v-model="item.shortDescription" :errors="v$.shortDescription.$errors" class="col-span-12" type="textarea" label="Short Description" name="short-description" placeholder="Short Description" />
                        <FormInputField v-model="item.description" :errors="v$.description.$errors" type="textarea" class="col-span-12" label="Description" name="short-description" placeholder="Description" />
                        <FormSelectField
                            v-model="item.parentId"
                            class="col-span-12 sm:col-span-6"
                            :errors="v$.parentId.$errors"
                            labelvalue="title"
                            :clearable="false"
                            keyvalue="id"
                            name="section-id"
                            :select-data="rows.data"
                            label="Section"
                            placeholder="Section"
                        />
                        <FormSelectField v-model="item.type" class="col-span-12 sm:col-span-6" :errors="v$.type.$errors" labelvalue="name" :clearable="false" keyvalue="id" name="type" :select-data="faqTypes" label="Type" placeholder="Type" />
                        <FormInputField v-model="item.orderId" type="number" :errors="v$.orderId.$errors" class="col-span-12 sm:col-span-6" label="Position" name="order-id" placeholder="Position" />
                        <FormSwitch v-model="item.active" :name="'active-' + item.id" :errors="v$.active.$errors" class="col-span-12 sm:col-span-4" label="Active" />
                        <FormSwitch v-model="item.mobile" :name="'active-' + item.id" :errors="v$.mobile.$errors" class="col-span-12 sm:col-span-4" label="Mobile" />
                    </div>
                    <div v-if="item.type === 'item'" class="lg:col-span-12 pt-5 border-t border-dashed mt-3">
                        <div class="font-medium">List Items</div>
                        <div class="box p-5 !shadow-none mt-5">
                            <div class="space-y-4">
                                <div v-for="(item, index) in item.list" :key="index" class="flex items-start gap-5">
                                    <FormInputField v-model="item.name" :disabled="usePermissionCheck(['conference_faq_update', 'conference_faq_create'])" class="grow" type="text" :name="'item-name-' + index" placeholder="Content" />
                                    <FormSwitch
                                        v-model="item.active"
                                        :disabled="usePermissionCheck(['conference_faq_update', 'conference_faq_create'])"
                                        :name="'item-active-' + index"
                                        :class="[item.active ? 'text-success' : 'text-danger', 'col-span-12 sm:col-span-5']"
                                        :flex-title="true"
                                        :label="item.active ? 'Active' : 'Inactive'"
                                    />
                                    <div class="col-span-12 sm:col-span-2">
                                        <button :disabled="usePermissionCheck(['conference_faq_update', 'conference_faq_create'])" type="button" class="btn btn-outline-danger btn-sm" @click="removeListItemRow(index)">
                                            <Icon name="solar:close-circle-outline" class="size-4 mr-2" />
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                                <button :disabled="usePermissionCheck(['conference_faq_update', 'conference_faq_create'])" type="button" class="btn btn-secondary btn-sm w-full" @click="addListItemRow">
                                    <Icon name="solar:add-circle-outline" class="size-4 mr-2" />
                                    <span>Add New</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="w-full flex items-center justify-end gap-5">
                    <button :disabled="formLoading" class="btn-rounded btn-sm btn btn-danger px-4" type="button" @click="closeModal">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:close-circle-linear'" class="w-5 h-5 mr-2" />
                        <span>Close</span>
                    </button>
                    <button v-if="usePermissionCheck(['conference_faq_update', 'conference_faq_create'])" :disabled="formLoading" class="btn-rounded btn-sm btn btn-primary px-4" type="button" @click="handleModalSubmit()">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:check-circle-broken'" class="w-5 h-5 mr-2" />
                        <span v-html="editMode ? 'Update' : 'Save'" />
                    </button>
                </div>
            </template>
        </TheModal>
    </div>
</template>
