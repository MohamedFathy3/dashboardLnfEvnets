<script setup>
definePageMeta({
    middleware: 'auth',
});
const serverParams = ref({
    startYear: null,
    endYear: null,
});
const config = useRuntimeConfig();

const years = useYearArray(2020);
const formLoading = ref(false);

const {
    data: rows,
    status,
    execute,
} = await useApiFetch(`/api/event/count-user-by-category/report`, {
    method: 'POST',
    body: serverParams,
    immediate: false,
    lazy: true,
});

const apply = async () => {
    formLoading.value = true;
    if (serverParams.value.startYear !== null && serverParams.value.endYear !== null) {
        await execute();
    } else {
        useToast({ title: 'Error', message: 'Please Select Start & End Dates', type: 'error', duration: 5000 });
    }
    formLoading.value = false;
};
</script>
<template>
    <div v-if="usePermissionCheck(['conference_report_member_by_category_list'])">
        <div>
            <!-- Page Title & Action Buttons -->
            <div class="md:flex md:items-center md:justify-between md:gap-5">
                <div class="flex items-center gap-2">
                    <Icon name="solar:users-group-two-rounded-line-duotone" class="size-5 opacity-75" />
                    <div>Events Attendees Report</div>
                </div>
                <div class="flex items-center gap-3">
                    <a :href="serverParams.startYear !== null && serverParams.endYear !== null ? config.public.apiUrl + `/export-pdf/count-user-by-category/download/${serverParams.startYear}/${serverParams.endYear}` : null" target="_blank">
                        <button
                            :title="serverParams.startYear === null || serverParams.endYear === null ? 'Please Select Start & End Date' : 'Click to Download'"
                            :disabled="serverParams.startYear === null || serverParams.endYear === null"
                            type="button"
                            class="btn btn-dark btn-rounded btn-sm w-full justify-between gap-3"
                        >
                            <span class="items-center flex">
                                <span>Download PDF</span>
                            </span>
                            <Icon name="solar:download-outline" class="w-5 h-5 mr-2" />
                        </button>
                    </a>
                    <a :href="serverParams.startYear !== null && serverParams.endYear !== null ? config.public.apiUrl + `/export-excel/count-user-by-category/event/${serverParams.startYear}/${serverParams.endYear}` : null" target="_blank">
                        <button
                            :title="serverParams.startYear === null || serverParams.endYear === null ? 'Please Select Start & End Date' : 'Click to Download'"
                            :disabled="serverParams.startYear === null || serverParams.endYear === null"
                            type="button"
                            class="btn btn-dark btn-rounded btn-sm w-full justify-between gap-3"
                        >
                            <span class="items-center flex">
                                <span>Download XLXS</span>
                            </span>
                            <Icon name="solar:download-outline" class="w-5 h-5 mr-2" />
                        </button>
                    </a>
                </div>
            </div>
        </div>
        <form class="mt-5 bg-white rounded-xl grid border lg:grid-cols-12 gap-5 items-center p-2" @submit.prevent="apply">
            <FormSelectField id="start-date" v-model.number="serverParams.startYear" class="lg:col-span-5" placeholder="Select Start Year" :select-data="years" labelvalue="name" keyvalue="id" />
            <FormSelectField id="end-date" v-model.number="serverParams.endYear" class="lg:col-span-5" placeholder="Select End Year" :select-data="years" labelvalue="name" keyvalue="id" />
            <button type="submit" :disabled="formLoading" class="lg:col-span-2 btn btn-rounded btn-sm btn-primary gap-3 w-full">
                <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:rounded-magnifer-line-duotone'" class="size-5 shrink-0" />
                Apply
            </button>
        </form>
        <div v-if="status !== 'pending'" class="mt-5">
            <table class="table table-report font-light">
                <thead>
                    <tr class="uppercase text-sm">
                        <th class="text-left">Conference</th>
                        <th class="text-center whitespace-nowrap">PFS Team</th>
                        <th class="text-center whitespace-nowrap">Paid</th>
                        <th class="text-center whitespace-nowrap">Free</th>
                        <th class="text-center whitespace-nowrap">WSA Team</th>
                        <th class="text-center whitespace-nowrap">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="status !== 'pending' && rows">
                        <tr v-for="row in rows.data" :key="row.name">
                            <td class="font-normal">{{ row.name }}</td>
                            <td class="font-light text-center">{{ row.pfsTeam }}</td>
                            <td class="font-light text-center">{{ row.paid }}</td>
                            <td class="font-light text-center">{{ row.free }}</td>
                            <td class="font-light text-center">{{ row.team }}</td>
                            <td class="font-semibold text-center">{{ row.pfsTeam + row.paid + row.free + row.team }}</td>
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
        </div>
        <div v-else class="flex min-h-dvh items-center place-content-center text-center">
            <div>
                <div class="opacity-75 text-sm animate-pulse">Loading...</div>
                <Icon name="eos-icons:three-dots-loading" class="size-16" />
            </div>
        </div>
    </div>
</template>
