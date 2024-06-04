<script setup>
definePageMeta({
    middleware: 'auth',
});
const loadingPage = ref(true);
const { data, execute } = await useApiFetch(`/api/dashboard/report/persons-dietaries`, {
    lazy: true,
    transform: (data) => data.data,
    immediate: false,
});
const persons = ref([]);
onMounted(async () => {
    loadingPage.value = true;
    await execute();
    loadingPage.value = false;
});
const resources = useResourceStore();
</script>
<template>
    <div>
        <div v-if="!loadingPage">
            <div class="overflow-x-scroll w-full">
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
                        <template v-if="data.length > 0">
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
                            <tr v-for="i in serverParams.perPage" :key="i">
                                <td colspan="5">
                                    <div class="h-12 !opacity-50 animate-pulse" />
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else class="text-center my-12 animate-pulse">Loading Data...</div>
    </div>
</template>
