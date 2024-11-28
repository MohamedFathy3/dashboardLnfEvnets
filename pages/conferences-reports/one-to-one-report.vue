<script setup>
import { useCheckDateIsPast } from '~/composables/useCheckDateIsPast';

definePageMeta({
    middleware: 'auth',
});
const loadingPage = ref(true);
const {
    data: meetings,
    execute,
    refresh,
} = await useApiFetch(`/api/event/one-to-one/report`, {
    lazy: true,
    immediate: false,
    transform: (meetings) => meetings.data,
});

async function setMeetingData(isOnline, tableNumber, zoomLink, delegateId, timeSlotId) {
    const formData = {
        delegateId: delegateId ?? null,
        timeSlotId: timeSlotId ?? null,
        isOnline: isOnline ?? false,
        zoomLink: zoomLink ?? null,
        tableNumber: tableNumber ?? null,
    };
    const { data, error } = await useApiFetch(`/api/event-delegate/one-to-one/save-table-number`, {
        method: 'POST',
        body: formData,
        lazy: true,
    });

    if (data.value) {
        await refresh();
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
}

onMounted(async () => {
    loadingPage.value = true;
    await execute();
    loadingPage.value = false;
});
const config = useRuntimeConfig();
</script>
<template>
    <div v-if="usePermissionCheck(['conference_report_one_to_one_list'])">
        <div v-if="!loadingPage">
            <!-- Page Title & Action Buttons -->
            <div class="md:flex md:items-center md:justify-between md:gap-5">
                <div class="flex items-center gap-2">
                    <Icon name="solar:alarm-linear" class="size-5 opacity-75" />
                    <div>One to One Meetings</div>
                </div>
                <div class="flex items-center gap-3">
                    <ConferenceSwitcher @reload="refresh" />
                </div>
            </div>
            <div v-if="usePermissionCheck(['conference_report_one_to_one_export'])" class="mt-8 bg-white p-5 rounded-xl border">
                <div class="font-medium pb-3 text-center mb-3">Export One to One Meetings</div>
                <div class="flex items-center justify-between gap-5">
                    <template v-for="day in meetings" :key="day.id">
                        <a v-if="day.timeSlots.length > 0" :href="config.public.apiUrl + '/export-pdf/one-to-one/view/' + day.id" target="_blank" class="grow">
                            <button type="button" class="btn btn-dark btn-rounded btn-sm w-full justify-between gap-3">
                                <span class="items-center flex">
                                    <Icon name="solar:calendar-linear" class="w-5 h-5 mr-2" />
                                    <span>Export {{ day.name }}</span>
                                </span>
                                <Icon name="solar:download-outline" class="w-5 h-5 mr-2" />
                            </button>
                        </a>
                    </template>
                </div>
            </div>
            <div v-if="meetings" class="mt-8">
                <template v-for="day in meetings" :key="day.id">
                    <!--<template v-if="!useCheckDateIsPast(day.date)">-->
                        <template v-if="day.timeSlots.length > 0">
                            <div class="bg-primary text-center text-white flex items-center py-2 px-4 text-base rounded-md justify-between">
                                <div class="items-center flex">
                                    <Icon name="solar:calendar-linear" class="opacity-70 w-5 h-5 mr-2" />
                                    <div>{{ day.name }}</div>
                                </div>
                                <div>{{ day.date }}</div>
                            </div>
                            <table class="table table-report">
                                <template v-for="(slot, index) in day.timeSlots" :key="index">
                                    <thead v-if="slot.sessionsRequests.length > 0">
                                        <tr class="text-sm uppercase">
                                            <th>Sender</th>
                                            <th>Receiver</th>
                                            <th>Table Number</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="!bg-slate-20 text-slate-500 text-center" colspan="3">
                                                <div class="font-medium text-base uppercase flex items-center place-content-center">
                                                    <div>{{ slot.from }}</div>
                                                    <Icon name="solar:double-alt-arrow-right-line-duotone" class="mx-2 w-4 h-4" />
                                                    <div>{{ slot.to }}</div>
                                                </div>
                                            </td>
                                        </tr>
                                        <template v-if="slot.sessionsRequests.length > 0">
                                            <tr v-for="session in slot.sessionsRequests" :key="session.id" class="text-sm">
                                                <td class="dark:!border-opacity-60 dark:!bg-opacity-60 whitespace-nowrap">
                                                    <div class="inline-flex text-left gap-3 items-center">
                                                        <img class="h-14 w-14 !rounded-full ring-2 -ring-offset-2 ring-slate-500/10 object-contain bg-white" :src="session.sender.imageUrl" :alt="session.sender.name" :title="session.sender.name" />
                                                        <div class="opacity-75">
                                                            <div class="truncate font-medium">{{ session.sender.name }}</div>
                                                            <div class="text-xs mt-0.5 truncate">{{ session.sender.jobTitle }}</div>
                                                            <div class="text-xs font-light mt-0.5 truncate">{{ session.sender.company.name }}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="dark:!border-opacity-60 dark:!bg-opacity-60 whitespace-nowrap">
                                                    <div class="inline-flex text-left gap-3 items-center">
                                                        <img
                                                            class="h-14 w-14 !rounded-full ring-2 -ring-offset-2 ring-slate-500/10 object-contain bg-white"
                                                            :src="session.receiver.imageUrl"
                                                            :alt="session.receiver.name"
                                                            :title="session.receiver.name"
                                                        />
                                                        <div class="opacity-75">
                                                            <div class="truncate font-medium">{{ session.receiver.name }}</div>
                                                            <div class="text-xs mt-0.5 truncate">{{ session.receiver.jobTitle }}</div>
                                                            <div class="text-xs font-light mt-0.5 truncate">{{ session.receiver.company.name }}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="flex items-center gap-5">
                                                        <FormInputField v-if="!session.isOnline" v-model="session.tableNumber" size="sm" class="grow min-w-[5rem]" placeholder="Table Number" :name="'table-number-' + session.id" />
                                                        <FormInputField v-else v-model="session.zoomLink" size="sm" class="grow min-w-[5rem]" placeholder="Zoom Link" :name="'zoom-link-' + session.id" />
                                                        <FormSwitch v-model="session.isOnline" :name="'online-' + session.id" flex-title :label="session.isOnline ? 'Online' : 'Table'" />
                                                        <button type="button" class="btn btn-primary btn-sm btn-rounded" @click="setMeetingData(session.isOnline, session.tableNumber, session.zoomLink, session.sender?.id, session.timeSlotId)">
                                                            Apply
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </template>
                            </table>
                        </template>
                    <!--</template>-->
                </template>
            </div>
        </div>
        <div v-else class="flex min-h-dvh items-center place-content-center text-center">
            <div>
                <div class="opacity-75 text-sm animate-pulse">Loading...</div>
                <Icon name="eos-icons:three-dots-loading" class="size-16" />
            </div>
        </div>
    </div>
</template>
