<script setup>
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

definePageMeta({
    middleware: 'auth',
});
const selectedRows = ref([]);
const sortByList = ref([
    { name: 'Sort By ID', value: 'id' },
    { name: 'Sort By From', value: 'time_from' },
    { name: 'Sort By Day', value: 'day_id' },
]);
const filter = ref({
    note: null,
});

const serverParams = ref({
    filters: {},
    orderBy: 'day_id',
    orderByDirection: 'asc',
    perPage: 25,
    page: 1,
    paginate: true,
});
const formLoading = ref(false);
const isOpen = ref(false);
const editMode = ref(false);
const resetServerParams = async () => {
    filter.value = {
        note: null,
    };
    serverParams.value = {
        filters: {},
        orderBy: 'day_id',
        orderByDirection: 'asc',
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
} = await useApiFetch('/api/time-slot/index', {
    method: 'POST',
    body: serverParams,
    lazy: true,
});
const { data: days, refreshDays } = await useApiFetch('/api/event-day/index', {
    method: 'POST',
    body: {
        orderBy: 'name',
        orderByDirection: 'asc',
        paginate: false,
    },
    lazy: true,
});

async function refreshAllData() {
    await refresh();
    await refreshDays();
}
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
    timeFrom: null,
    timeTo: null,
    note: null,
    active: true,
    defaultStatus: true,
    dayId: null,
});
const rules = ref({
    timeFrom: { required },
    timeTo: { required },
    note: {},
    active: {},
    defaultStatus: {},
    dayId: { required },
});
const v$ = useVuelidate(rules, item);
const fetchItem = async (id) => {
    const { data, error } = await useApiFetch(`/api/time-slot/${id}`, {
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
        timeFrom: null,
        timeTo: null,
        note: null,
        active: true,
        defaultStatus: true,
        dayId: null,
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
    const { data, error } = await useApiFetch(`/api/time-slot/${item.value?.id}`, {
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
    const { data, error } = await useApiFetch(`/api/time-slot`, {
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
        const { data, error } = await useApiFetch(`/api/time-slot/delete`, {
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
function convertTo12HourFormat(time) {
    const [hours, minutes] = time.split(':');
    let parsedHours = parseInt(hours, 10);
    const period = parsedHours >= 12 ? 'PM' : 'AM';
    parsedHours = parsedHours % 12 || 12;
    return `${parsedHours}:${minutes} ${period}`;
}

function formatTime(date) {
    return date.toTimeString().slice(0, 5);
}

const generateTimeOptions = computed(() => {
    const timeSelectionArray = [];
    const interval = 30; // 15 minutes interval

    // Start time
    const startTime = new Date();
    startTime.setHours(9);
    startTime.setMinutes(0);

    // End time
    const endTime = new Date();
    endTime.setHours(18);
    endTime.setMinutes(0);

    // Loop through each interval and generate time values
    for (let time = startTime.getTime(); time <= endTime.getTime(); time += interval * 60 * 1000) {
        const date = new Date(time);
        const formattedTime = formatTime(date);
        timeSelectionArray.push({
            name: formattedTime,
            value: formattedTime,
        });
    }

    return timeSelectionArray;
});
</script>
<template>
    <div class="flex flex-col gap-8">
        <!-- Page Title & Action Buttons -->
        <div class="md:flex md:items-center md:justify-between md:gap-5">
            <div class="flex items-center gap-2">
                <Icon name="solar:asteroid-linear" class="size-5 opacity-75" />
                <div>Time Slots</div>
            </div>
            <div class="flex items-center gap-3">
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
                <ConferenceSwitcher @reload="refreshAllData" />
            </div>
        </div>
        <ConferenceOldWarning />
        <!-- Filter & Search -->
        <div class="grid lg:grid-cols-12 gap-5 items-center p-5 bg-white border rounded-2xl">
            <FormInputField v-model="filter.note" rounded class="xl:col-span-4 lg:col-span-4" placeholder="Note" />
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
                    <th>Time</th>
                    <th>Day</th>
                    <th>Note</th>
                    <th class="text-center">Active</th>
                    <th class="text-center">Default Status</th>
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
                            <div>{{ convertTo12HourFormat(row.timeFrom) }}</div>
                            <div class="font-light opacity-75">{{ convertTo12HourFormat(row.timeTo) }}</div>
                        </td>
                        <td>
                            <div class="font-normal">{{ row.day.name }}</div>
                            <div class="font-light opacity-75">{{ row.day.date }}</div>
                        </td>
                        <td class="font-medium">
                            <div class="opacity-75">{{ row.note }}</div>
                        </td>
                        <td>
                            <div class="flex items-center place-content-center">
                                <FormSwitch :id="'row-active-' + row.id" v-model="row.active" @change="useToggleSwitch(row.id, 'active', 'time-slot')" />
                            </div>
                        </td>
                        <td>
                            <div class="flex items-center place-content-center">
                                <FormSwitch :id="'row-active-' + row.id" v-model="row.defaultStatus" @change="useToggleSwitch(row.id, 'default_status', 'time-slot')" />
                            </div>
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
                        <td colspan="7">
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
                    <FormSelectField v-model="item.timeFrom" :errors="v$.timeFrom.$errors" labelvalue="name" keyvalue="value" :select-data="generateTimeOptions" class="lg:col-span-6" label="From" name="time-slot-from" placeholder="From" />
                    <FormSelectField v-model="item.timeTo" :errors="v$.timeTo.$errors" labelvalue="name" keyvalue="value" :select-data="generateTimeOptions" class="lg:col-span-6" label="To" name="time-slot-to" placeholder="To" />
                    <FormInputField v-model="item.note" :errors="v$.note.$errors" class="col-span-12" label="Note" name="name" placeholder="Note" />
                    <FormSwitch v-model="item.active" :errors="v$.active.$errors" class="lg:col-span-4" label="Active" name="active-input" />
                    <FormSwitch v-model="item.defaultStatus" :errors="v$.defaultStatus.$errors" class="lg:col-span-4" label="Default Status" name="default-status-input" />
                    <FormSelectField v-model="item.dayId" :errors="v$.dayId.$errors" labelvalue="name" keyvalue="id" :select-data="days.data" class="lg:col-span-4" label="Event Day" name="day-id" placeholder="Event Day" />
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
