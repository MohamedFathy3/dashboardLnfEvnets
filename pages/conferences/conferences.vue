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
    countryId: null,
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
const editMode = ref(false);
const resetServerParams = async () => {
    filter.value = {
        name: null,
        countryId: null,
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
} = await useApiFetch('/api/conference/index', {
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
    venue: null,
    cityId: null,
    countryId: null,
    virtual: false,
    active: null,
    orderId: null,
    duration: null,
    logo: null,
    logoDark: null,
    logoMobile: null,
    earlyBirdActive: false,
    earlyBirdEndDate: null,
    regDeadlineDate: null,
    hotelBookingMaxDuration: null,
    ebMemberDelegatePrice: 0,
    ebMemberSpousePrice: 0,
    ebNonMemberDelegatePrice: 0,
    ebNonMemberSpousePrice: 0,
    memberDelegatePrice: 0,
    memberSpousePrice: 0,
    nonMemberDelegatePrice: 0,
    nonMemberSpousePrice: 0,
});
const rules = ref({
    name: { required },
    venue: { required },
    cityId: { numeric, required },
    countryId: { numeric, required },
    virtual: {},
    active: {},
    orderId: { numeric },
    duration: { required },
    logo: { required },
    logoDark: { required },
    logoMobile: { required },
    earlyBirdActive: { required },
    earlyBirdEndDate: { required },
    regDeadlineDate: { required },
    hotelBookingMaxDuration: { required },
    ebMemberDelegatePrice: { numeric, required },
    ebMemberSpousePrice: { numeric, required },
    ebNonMemberDelegatePrice: { numeric, required },
    ebNonMemberSpousePrice: { numeric, required },
    memberDelegatePrice: { numeric, required },
    memberSpousePrice: { numeric, required },
    nonMemberDelegatePrice: { numeric, required },
    nonMemberSpousePrice: { numeric, required },
});
const v$ = useVuelidate(rules, item);
const fetchItem = async (id) => {
    const { data, error } = await useApiFetch(`/api/conference/${id}`, {
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
        venue: null,
        cityId: null,
        countryId: null,
        virtual: false,
        active: null,
        orderId: null,
        duration: null,
        logo: null,
        logoDark: null,
        logoMobile: null,
        earlyBirdActive: false,
        earlyBirdEndDate: null,
        regDeadlineDate: null,
        hotelBookingMaxDuration: null,
        ebMemberDelegatePrice: 0,
        ebMemberSpousePrice: 0,
        ebNonMemberDelegatePrice: 0,
        ebNonMemberSpousePrice: 0,
        memberDelegatePrice: 0,
        memberSpousePrice: 0,
        nonMemberDelegatePrice: 0,
        nonMemberSpousePrice: 0,
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
    const { data, error } = await useApiFetch(`/api/conference/${item.value?.id}`, {
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
    const { data, error } = await useApiFetch(`/api/conference`, {
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
        const { data, error } = await useApiFetch(`/api/conference/delete`, {
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
        const { data, error } = await useApiFetch(`/api/conference/force-delete`, {
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
        const { data, error } = await useApiFetch(`/api/conference/restore`, {
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
const resources = useResourceStore();

const filteredCities = computed(() => {
    if (item.value.countryId) {
        return resources?.cities.filter((city) => city.countryId === item.value.countryId);
    }
    return [];
});

const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
};
</script>
<template>
    <div v-if="usePermissionCheck(['conference_list'])" class="flex flex-col gap-8">
        <!-- Page Title & Action Buttons -->
        <div class="md:flex md:items-center md:justify-between md:gap-5">
            <div class="flex items-center gap-2">
                <Icon name="solar:calendar-outline" class="size-5 opacity-75" />
                <div>{{ serverParams.deleted ? 'Deleted Conferences' : 'Conferences' }}</div>
            </div>
            <div class="md:flex md:items-center md:gap-5 md:space-y-0 space-y-5">
                <template v-if="selectedRows.length > 0">
                    <template v-if="serverParams.deleted">
                        <button v-if="usePermissionCheck(['conference_force_delete'])" class="btn btn-danger btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="forceDeleteItems">
                            <Icon name="solar:trash-bin-minimalistic-line-duotone" class="size-5 opacity-75" />
                            Delete Permanently
                        </button>
                    </template>
                    <template v-else>
                        <button v-if="usePermissionCheck(['conference_delete'])" class="btn btn-danger btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="deleteItems">
                            <Icon name="solar:trash-bin-minimalistic-line-duotone" class="size-5 opacity-75" />
                            Delete Items
                        </button>
                    </template>
                    <template v-if="serverParams.deleted">
                        <button v-if="usePermissionCheck(['conference_restore'])" class="btn btn-success btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="restoreItems">
                            <Icon name="solar:restart-circle-outline" class="size-5 opacity-75" />
                            Restore Items
                        </button>
                    </template>
                </template>
                <button v-if="usePermissionCheck(['conference_create'])" :disabled="serverParams.deleted" class="btn btn-primary btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="openModal()">
                    <Icon name="solar:add-square-linear" class="size-5 opacity-75" />
                    Add New
                </button>
                <button v-if="usePermissionCheck(['conference_delete', 'conference_force_delete', 'conference_restore'])" class="btn btn-primary btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="toggleDeleted">
                    <Icon :name="serverParams.deleted ? 'solar:hamburger-menu-line-duotone' : 'solar:trash-bin-minimalistic-line-duotone'" class="size-5 opacity-75" />
                    {{ serverParams.deleted ? 'Items List' : 'Deleted Items' }}
                </button>
            </div>
        </div>
        <!-- Filter & Search -->
        <div class="grid lg:grid-cols-12 gap-5 items-center p-5 bg-white border rounded-2xl">
            <FormInputField v-model="filter.name" rounded class="xl:col-span-6 lg:col-span-6" placeholder="Name" />
            <FormSelectField id="filter-by-country" v-model="filter.countryId" class="lg:col-span-6 xl:col-span-6" placeholder="Please select a country..." :select-data="resources.countries" labelvalue="name" keyvalue="id" imgvalue="imageUrl" />
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
                    <th>Details</th>
                    <th v-if="serverParams.deleted">Deleted At</th>
                    <th class="text-right">Action</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="status !== 'pending' && rows">
                    <tr v-for="row in rows.data" :key="row.id">
                        <td>
                            <input :checked="isSelected(row.id)" type="checkbox" class="form-check-input" @change="toggleRowSelection(row.id)" />
                        </td>
                        <td class="font-normal">
                            <div class="flex items-center gap-3">
                                <NuxtImg :src="row.logoUrl" :alt="row.name" :title="row.name" class="w-20 h-10 bg-white object-contain p-1 !rounded-md" />
                                <div>
                                    <div class="text-sm">{{ row.name }}</div>
                                    <div class="font-light text-xs flex items-center gap-1.5 mt-0.5">
                                        <NuxtImg :src="row.flag" :alt="row.country" :title="row.country" class="h-4 object-contain !border-0" />
                                        <span class="font-medium">{{ row.country }},</span>
                                        <span>{{ row.city }}</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div>
                                <div class="text-sm font-normal flex items-center gap-3">
                                    <div class="opacity-75">{{ formatDate(row.duration[0]) }}</div>
                                    <Icon name="solar:double-alt-arrow-right-line-duotone" class="size-4 opacity-50 shrink-0" />
                                    <div class="opacity-75">{{ formatDate(row.duration[1]) }}</div>
                                </div>
                                <div class="font-medium text-sm mt-0.5 opacity-75">Early Bird<span :class="[row.earlyBirdActive ? 'text-success' : 'text-danger', 'opacity-100 ml-1.5']" v-html="row.earlyBirdActive ? 'Active' : 'Inactive'" /></div>
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

        <TheModal :open-modal="isOpen" size="5xl" @close-modal="closeModal()">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="font-medium" v-html="editMode ? 'Update Conference' : 'Add New Conference'"></div>
                    <Icon class="w-8 h-8 opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300" name="solar:close-square-outline" @click="closeModal" />
                </div>
            </template>
            <template #content>
                <div class="grid lg:grid-cols-12 gap-5 items-start">
                    <div class="lg:col-span-4">
                        <FormUploader v-model="item.logo" :errors="v$.logo.$errors" :allowed-types="['image', 'svg']" label="Logo" name="logo" />
                        <FormUploader v-model="item.logoDark" :errors="v$.logoDark.$errors" :allowed-types="['image', 'svg']" label="Logo-dark" name="logo-dark" />
                        <FormUploader v-model="item.logoMobile" :errors="v$.logoMobile.$errors" :allowed-types="['image', 'svg']" label="Logo-mobile" name="logo-mobile" />
                    </div>
                    <div class="lg:col-span-8 grid lg:grid-cols-12 gap-5 items-center">
                        <FormInputField v-model="item.name" :errors="v$.name.$errors" class="lg:col-span-12" label="Name" name="name" placeholder="Name" />
                        <FormInputField v-model="item.venue" :errors="v$.venue.$errors" class="lg:col-span-12" label="Venue" name="venue" placeholder="Venue" />
                        <FormSelectField
                            id="country-id"
                            v-model="item.countryId"
                            :errors="v$.countryId.$errors"
                            label="Country"
                            class="lg:col-span-6"
                            placeholder="Please select a country..."
                            :select-data="resources.countries"
                            labelvalue="name"
                            keyvalue="id"
                            imgvalue="imageUrl"
                        />
                        <FormSelectField
                            id="city-id"
                            v-model="item.cityId"
                            :disabled="!item.countryId"
                            :errors="v$.cityId.$errors"
                            label="City"
                            class="lg:col-span-6"
                            placeholder="Please select a city..."
                            :select-data="filteredCities"
                            labelvalue="name"
                            keyvalue="id"
                        />
                        <FormDatePicker v-model="item.duration" range :time-picker="false" :errors="v$.duration.$errors" placeholder="Select Start & End Dates" class="lg:col-span-6" label="Duration" name="duration" format="dd-MM-yyyy" />
                        <FormInputField v-model="item.orderId" :errors="v$.orderId.$errors" class="lg:col-span-6" label="Order" name="order-id" placeholder="Order Number" />
                        <FormSwitch id="active" v-model="item.active" name="active" :errors="v$.active.$errors" class="lg:col-span-4" label="Active" />
                        <FormSwitch id="virtual" v-model="item.virtual" name="virtual" :errors="v$.virtual.$errors" class="lg:col-span-4" label="Virtual" />
                        <FormSwitch id="early-bird-active" v-model="item.earlyBirdActive" name="early-bird-active" :errors="v$.earlyBirdActive.$errors" class="lg:col-span-4" label="Early Bird Active" />
                        <FormDatePicker v-model="item.earlyBirdEndDate" :time-picker="true" :errors="v$.earlyBirdEndDate.$errors" placeholder="Early Bird End Date" class="lg:col-span-6" label="Early Bird End Date" name="early-bird-end-date" />
                        <FormDatePicker
                            v-model="item.regDeadlineDate"
                            :time-picker="true"
                            :errors="v$.regDeadlineDate.$errors"
                            placeholder="Registration Deadline Date"
                            class="lg:col-span-6"
                            label="Registration Deadline Date"
                            name="early-bird-end-date"
                        />
                        <FormDatePicker
                            v-model="item.hotelBookingMaxDuration"
                            range
                            format="dd-MM-yyyy"
                            :time-picker="false"
                            :errors="v$.hotelBookingMaxDuration.$errors"
                            placeholder="Hotel Booking Max Duration"
                            class="lg:col-span-12"
                            label="Hotel Booking Max Duration"
                            name="hotel-booking-max-duration"
                        />
                        <div class="col-span-12 font-medium py-3 px-6 text-sm bg-slate-100 rounded-full opacity-75">Early Bird Prices</div>
                        <FormInputField
                            v-model="item.ebMemberDelegatePrice"
                            type="number"
                            :errors="v$.ebMemberDelegatePrice.$errors"
                            class="col-span-12 sm:col-span-6"
                            label="EarlyBird Member Delegate Price"
                            name="eb-member-delegate-price"
                            placeholder="EarlyBird Member Delegate Price"
                        />
                        <FormInputField
                            v-model="item.ebMemberSpousePrice"
                            type="number"
                            :errors="v$.ebMemberSpousePrice.$errors"
                            class="col-span-12 sm:col-span-6"
                            label="EarlyBird Member Spouse Price"
                            name="eb-member-spouse-price"
                            placeholder="EarlyBird Member Spouse Price"
                        />
                        <FormInputField
                            v-model="item.ebNonMemberDelegatePrice"
                            type="number"
                            :errors="v$.ebNonMemberDelegatePrice.$errors"
                            class="col-span-12 sm:col-span-6"
                            label="EarlyBird Non Member Delegate Price"
                            name="eb-non-member-delegate-price"
                            placeholder="EarlyBird Non Member Delegate Price"
                        />
                        <FormInputField
                            v-model="item.ebNonMemberSpousePrice"
                            type="number"
                            :errors="v$.ebNonMemberSpousePrice.$errors"
                            class="col-span-12 sm:col-span-6"
                            label="EarlyBird Non Member Spouse Price"
                            name="eb-non-member-spouse-price"
                            placeholder="EarlyBird Non Member Spouse Price"
                        />
                        <div class="col-span-12 font-medium py-3 px-6 text-sm bg-slate-100 rounded-full opacity-75">Regular Prices</div>
                        <FormInputField
                            v-model="item.memberDelegatePrice"
                            type="number"
                            :errors="v$.memberDelegatePrice.$errors"
                            class="col-span-12 sm:col-span-6"
                            label="Member Delegate Price"
                            name="member-delegate-price"
                            placeholder="Member Delegate Price"
                        />
                        <FormInputField
                            v-model="item.memberSpousePrice"
                            type="number"
                            :errors="v$.memberSpousePrice.$errors"
                            class="col-span-12 sm:col-span-6"
                            label="Member Spouse Price"
                            name="member-spouse-price"
                            placeholder="Member Spouse Price"
                        />
                        <FormInputField
                            v-model="item.nonMemberDelegatePrice"
                            type="number"
                            :errors="v$.nonMemberDelegatePrice.$errors"
                            class="col-span-12 sm:col-span-6"
                            label="Non Member Delegate Price"
                            name="non-member-delegate-price"
                            placeholder="Non Member Delegate Price"
                        />
                        <FormInputField
                            v-model="item.nonMemberSpousePrice"
                            type="number"
                            :errors="v$.nonMemberSpousePrice.$errors"
                            class="col-span-12 sm:col-span-6"
                            label="Non Member Spouse Price"
                            name="non-member-spouse-price"
                            placeholder="Non Member Spouse Price"
                        />
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="w-full flex items-center justify-end gap-5">
                    <button :disabled="formLoading" class="btn-rounded btn-sm btn btn-danger px-4" type="button" @click="closeModal">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:close-circle-linear'" class="w-5 h-5 mr-2" />
                        <span>Close</span>
                    </button>
                    <button v-if="usePermissionCheck(['conference_create', 'conference_update'])" :disabled="formLoading" class="btn-rounded btn-sm btn btn-primary px-4" type="button" @click="handleModalSubmit()">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:check-circle-broken'" class="w-5 h-5 mr-2" />
                        <span v-html="editMode ? 'Update' : 'Save'" />
                    </button>
                </div>
            </template>
        </TheModal>
    </div>
</template>
