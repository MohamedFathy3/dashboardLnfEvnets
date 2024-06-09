<script setup>
import { numeric, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

definePageMeta({
    middleware: 'auth',
});
const selectedRows = ref([]);
const sortByList = ref([
    { name: 'Sort By ID', value: 'id' },
    { name: 'Sort By Code', value: 'code' },
]);
const filter = ref({
    code: null,
});

const serverParams = ref({
    filters: {},
    orderBy: 'id',
    orderByDirection: 'asc',
    perPage: 25,
    page: 1,
    paginate: true,
});
const couponTypes = ref([
    { id: 'all', name: 'All' },
    { id: 'delegate', name: 'Delegates' },
    { id: 'spouse', name: 'Spouses' },
    { id: 'delegate_spouse', name: 'Delegates & Spouses' },
    { id: 'room', name: 'Rooms' },
    { id: 'sponsorship_item', name: 'Sponsorship Items' },
]);
const discountTypes = ref([
    { id: 'fixed', name: 'Fixed' },
    { id: 'percentage', name: 'Percentage' },
]);
const formLoading = ref(false);
const isOpen = ref(false);
const editMode = ref(false);
const resetServerParams = async () => {
    filter.value = {
        code: null,
    };
    serverParams.value = {
        filters: {},
        orderBy: 'id',
        orderByDirection: 'desc',
        perPage: 25,
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
} = await useApiFetch('/api/coupon/index', {
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
    code: null,
    discountValue: null,
    discountType: null,
    couponType: null,
    count: null,
    totalUsedCompanies: [],
    active: true,
});
const rules = ref({
    code: { required },
    discountValue: { numeric, required },
    discountType: { required },
    couponType: { required },
    count: { required, numeric },
    active: {},
});
const v$ = useVuelidate(rules, item);
const fetchItem = async (id) => {
    const { data, error } = await useApiFetch(`/api/coupon/${id}`, {
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
        code: null,
        discountValue: null,
        discountType: null,
        couponType: null,
        count: null,
        totalUsedCompanies: [],
        active: true,
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
    const { data, error } = await useApiFetch(`/api/coupon/${item.value?.id}`, {
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
    const { data, error } = await useApiFetch(`/api/coupon`, {
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
        const { data, error } = await useApiFetch(`/api/coupon/delete`, {
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
</script>
<template>
    <div class="flex flex-col gap-8">
        <!-- Page Title & Action Buttons -->
        <div class="md:flex md:items-center md:justify-between md:gap-5">
            <div class="flex items-center gap-2">
                <Icon name="solar:asteroid-linear" class="size-5 opacity-75" />
                <div>Coupons</div>
            </div>
            <div class="md:flex md:items-center md:gap-5 md:space-y-0 space-y-5">
                <template v-if="selectedRows.length > 0">
                    <button class="btn btn-danger btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="deleteItems">
                        <Icon name="solar:trash-bin-minimalistic-line-duotone" class="size-5 opacity-75" />
                        Delete Items
                    </button>
                </template>
                <button class="btn btn-primary btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="openModal()">
                    <Icon name="solar:add-square-linear" class="size-5 opacity-75" />
                    Add New
                </button>
            </div>
        </div>
        <!-- Filter & Search -->
        <div class="grid lg:grid-cols-12 gap-5 items-center p-5 bg-white border rounded-2xl">
            <FormInputField v-model="filter.code" rounded class="xl:col-span-4 lg:col-span-4" placeholder="Code" />
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
                    <th class="text-right">Action</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="!pending && rows">
                    <tr v-for="row in rows.data" :key="row.id" class="text-sm">
                        <td>
                            <input :checked="isSelected(row.id)" type="checkbox" class="form-check-input" @change="toggleRowSelection(row.id)" />
                        </td>
                        <td>
                            <div class="font-normal">{{ row.code }}</div>
                            <div class="font-light text-sm opacity-75">{{ couponTypes.find((i) => i.id === row.couponType).name }}</div>
                        </td>
                        <td>
                            <div>
                                <div class="font-normal"><span class="mr-2">Count:</span>{{ row.count }}</div>
                                <div v-if="row.available" class="text-success"><span class="font-light mr-2">Available:</span>{{ row.availableCount }}</div>
                                <div v-else class="text-danger font-medium">Totally Used</div>
                            </div>
                        </td>
                        <td>
                            <div class="font-normal">
                                <span v-if="row.discountType === 'fixed'" class="mr-0.5">-</span>
                                <span>{{ row.discountValue }}</span>
                                <span v-if="row.discountType !== 'fixed'" class="ml-0.5">%</span>
                            </div>
                            <div class="text-xs italic">{{ discountTypes.find((i) => i.id === row.discountType).name }}</div>
                        </td>
                        <td>
                            <FormSwitch :id="'row-active-' + row.id" v-model="row.active" @change="useToggleSwitch(row.id, 'active', 'coupon')" />
                        </td>
                        <td class="text-right">
                            <div>
                                <button class="btn btn-secondary btn-rounded btn-sm gap-3" @click="openModal(row.id)">
                                    <Icon name="solar:pen-new-round-outline" class="size-4" />
                                    Edit
                                </button>
                            </div>
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <tr v-for="i in serverParams.perPage" :key="i">
                        <td colspan="4">
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
                    <FormInputField v-model="item.code" :errors="v$.code.$errors" class="col-span-12 sm:col-span-4" label="Code" :name="'code-' + item.id" placeholder="Code" />
                    <FormInputField v-model="item.discountValue" :errors="v$.discountValue.$errors" type="number" class="col-span-12 sm:col-span-4" label="Discount Value" :name="'discount-value-' + item.id" placeholder="Discount Value" />
                    <FormInputField v-model="item.count" :errors="v$.count.$errors" class="col-span-12 sm:col-span-4" type="number" label="Count" :name="'count-' + item.id" placeholder="Count" />
                    <FormSelectField
                        v-model="item.couponType"
                        class="col-span-12 sm:col-span-4"
                        :errors="v$.couponType.$errors"
                        labelvalue="name"
                        :clearable="false"
                        keyvalue="id"
                        :name="'type-' + item.id"
                        :select-data="couponTypes"
                        label="Coupon Type"
                        placeholder="Coupon Type"
                    />
                    <FormSelectField
                        v-model="item.discountType"
                        class="col-span-12 sm:col-span-4"
                        :errors="v$.discountType.$errors"
                        labelvalue="name"
                        :clearable="false"
                        keyvalue="id"
                        :name="'type-' + item.id"
                        :select-data="discountTypes"
                        label="Discount Type"
                        placeholder="Discount Type"
                    />
                    <FormSwitch v-model="item.active" :name="'active-' + item.id" :errors="v$.active.$errors" class="col-span-12 sm:col-span-4" label="Active" />
                    <div v-if="editMode" class="col-span-12 border-t border-dashed pt-3">
                        <div v-if="item?.totalUsedCompanies?.length > 0">
                            <div>Used for these Companies</div>
                            <ul class="mt-3 list-inside">
                                <li v-for="(company, index) in item?.totalUsedCompanies" :key="company.id" class="text-sm font-medium py-3 grid lg:grid-cols-12 items-center odd:bg-slate-100 rounded-full px-6 my-0.5">
                                    <div class="font-light text-primary">{{ index + 1 }}.</div>
                                    <div class="lg:col-span-5">{{ company.name }}</div>
                                    <div class="lg:col-span-3 font-normal">
                                        {{ company.countryName }}, <span class="font-light">{{ company.city }}</span>
                                    </div>
                                    <div class="lg:col-span-3">{{ company.email }}</div>
                                </li>
                            </ul>
                        </div>
                        <div v-else class="text-center py-8 font-normal opacity-50">Not Used yet</div>
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
