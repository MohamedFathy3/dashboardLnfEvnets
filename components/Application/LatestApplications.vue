<script setup>
const props = defineProps({
    data: {
        type: Array,
        required: true,
        default: () => [],
    },
});
</script>

<template>
    <div>
        <div class="flex items-center justify-between gap-5">
            <div class="flex items-center gap-3">
                <Icon name="solar:buildings-3-line-duotone" class="opacity-75 size-5" />
                <span class="font-medium">Latest Applications</span>
            </div>
            <NuxtLink class="text-xs px-2 py-1 rounded-full bg-white border" href="/members-data/pending-applications">View More</NuxtLink>
        </div>
        <div class="overflow-x-auto">
            <table class="table table-report font-light">
                <tbody>
                    <template v-if="props.data.length > 0">
                        <template v-for="row in props.data" :key="row.id">
                            <tr>
                                <td class="text-sm font-normal whitespace-nowrap">
                                    <div class="flex items-center gap-3">
                                        <NuxtImg :src="row.imageUrl" class="h-10 !rounded-md w-20 object-contain p-1 shrink-0" />
                                        <div class="flex flex-col gap-0.5">
                                            <div class="flex items-center gap-1.5">
                                                <span class="truncate 2xl:max-w-44 max-w-36 text-xs">{{ row.name }}</span>
                                                <Icon v-if="row.currentNetworkStatus.fpp" name="solar:shield-star-bold" class="size-5 text-success" />
                                            </div>
                                            <div class="flex items-center text-xs whitespace-nowrap">
                                                <NuxtImg :src="row.country.imageUrl" class="h-4 !rounded-sm w-6 object-cover shrink-0 mr-1.5" />
                                                <div class="opacity-75 font-semibold">{{ row.country.name }}</div>
                                                <span class="capitalize font-light opacity-80">, {{ row.city.toLowerCase() }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="whitespace-nowrap">
                                        <template v-for="application in row.pendingNetworkStatus" :key="application.id">
                                            <div class="text-xs">
                                                <div class="flex items-center gap-1.5">
                                                    <Icon name="solar:calendar-linear" class="size-4 opacity-75" />
                                                    <div>{{ application.createdAtFormatted }}</div>
                                                </div>
                                                <div class="font-medium mt-1 opacity-75">{{ application.createdSince }}</div>
                                            </div>
                                        </template>
                                    </div>
                                </td>
                                <td>
                                    <template v-if="row.currentNetworkStatus"> </template>
                                </td>
                                <td class="text-right">
                                    <div>
                                        <NuxtLink :to="'/members-data/members/' + row.id">
                                            <button class="btn btn-secondary btn-rounded btn-sm gap-3 size-8">
                                                <Icon name="solar:eye-outline" class="size-4 shrink-0" />
                                            </button>
                                        </NuxtLink>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped></style>
