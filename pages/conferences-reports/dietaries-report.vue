<script setup>
definePageMeta({
    middleware: 'auth',
});
const { data, refresh, status } = await useApiFetch(`/api/dashboard/report/persons-dietaries`, {
    lazy: true,
    transform: (data) => data.data,
});
const config = useRuntimeConfig();

const resources = useResourceStore();
</script>
<template>
    <div v-if="usePermissionCheck(['conference_report_dietary_list'])">
        <div>
            <!-- Page Title & Action Buttons -->
            <div class="md:flex md:items-center md:justify-between md:gap-5">
                <div class="flex items-center gap-2">
                    <Icon name="solar:chef-hat-line-duotone" class="size-5 opacity-75" />
                    <div>T-Shirts Sizes Report</div>
                </div>
                <div class="flex items-center gap-3">
                    <a v-if="usePermissionCheck(['conference_report_dietary_export'])" :href="config.public.apiUrl + '/export-excel/dietary-delegate/export'" target="_blank">
                        <button type="button" class="btn btn-dark btn-rounded btn-sm w-full justify-between gap-3">
                            <span class="items-center flex">
                                <Icon name="solar:t-shirt-outline" class="w-5 h-5 mr-2" />
                                <span>Export Dietaries</span>
                            </span>
                            <Icon name="solar:download-outline" class="w-5 h-5 mr-2" />
                        </button>
                    </a>
                    <ConferenceSwitcher @reload="refresh" />
                </div>
            </div>
            <div class="overflow-x-auto w-full">
                <!-- Persons Table -->
                <table class="table table-report font-light">
                    <thead>
                        <tr class="uppercase text-xs">
                            <th>Person</th>
                            <template v-for="diet in resources.dietaries" :key="diet.id">
                                <th class="text-center">{{ diet.name }}</th>
                            </template>
                            <th>Other</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="status !== 'pending'">
                            <template v-if="data && data.length > 0">
                                <tr v-for="row in data" :key="row.id" class="text-sm">
                                    <td class="font-normal">
                                        <div class="flex items-center gap-3 whitespace-nowrap">
                                            <NuxtImg :src="row.imageUrl" :alt="row.name" :title="row.name" class="size-14 object-cover !rounded-full ring ring-slate-500/25" />
                                            <div class="space-y-0.5">
                                                <div>{{ row.name }}</div>
                                                <div class="text-xs font-light capitalize">{{ row.type }}</div>
                                                <div class="text-xs font-light truncate line-clamp-1">{{ row.company.name }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <template v-for="diet in resources.dietaries" :key="diet.id">
                                        <td class="text-center">
                                            <div class="flex items-center place-content-center">
                                                <Icon v-if="row.dietaries.some((d) => d.id === diet.id)" name="solar:check-circle-bold-duotone" class="size-8 text-success" />
                                                <Icon v-else name="solar:close-circle-bold-duotone" class="size-8 text-slate-300" />
                                            </div>
                                        </td>
                                    </template>
                                    <td>{{ row.extraDietaries }}</td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr>
                                    <td colspan="8">
                                        <div class="text-center text-sm py-8 italic opacity-75">No Data Found</div>
                                    </td>
                                </tr>
                            </template>
                        </template>
                        <template v-else>
                            <tr v-for="i in 10" :key="i">
                                <td colspan="8">
                                    <div class="h-12 !opacity-25 animate-pulse" />
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
