<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        label: string;
        icon: string;
        data: Visit;
    }>(),
    {
        label: 'Top Visited Countries',
        icon: 'solar:asteroid-linear',
    },
);
</script>

<template>
    <div class="lg:col-span-3">
        <div>
            <div class="p-5 bg-white rounded-2xl">
                <div>
                    <div class="flex items-center gap-3">
                        <Icon v-if="props.icon" :name="props.icon" class="opacity-75 size-5" />
                        <span class="font-medium">{{ props.label }}</span>
                    </div>
                    <div class="text-xs font-light mt-1 ml-8 opacity-75">
                        Total <span class="font-medium">{{ props.data.totalCountries }}</span> Countries has <span class="font-medium">{{ props.data.totalCount }}</span> Records
                    </div>
                </div>
                <ul class="mt-5 divide-y divide-slate-200 divide-dashed">
                    <template v-for="item in (data as Visit).data as VisitData[]" :key="item.country.id">
                        <li class="py-2">
                            <div class="flex items-center justify-between gap- text-sm">
                                <div class="flex items-center gap-3">
                                    <NuxtImg :alt="item.country.name" :src="item.country.imageUrl" :title="item.country.name" class="w-6 h-6 rounded-full object-cover ring-2 ring-slate-200" />
                                    <div class="font-light">{{ item.country.name }}</div>
                                </div>
                                <div>{{ item.count }}</div>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>
