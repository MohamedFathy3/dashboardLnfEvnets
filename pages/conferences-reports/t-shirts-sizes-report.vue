<script setup>
definePageMeta({
    middleware: 'auth',
});

const selectedTabIndex = ref(0);
const selectedContent = ref(null);
const loadingPage = ref(false);
const shirts = ref([]);
const personsLengths = ref([]);
const sumPersonsLengths = ref(0);

const {
    data: shirtsData,
    execute,
    refresh,
} = await useApiFetch(`/api/event/tshirt-sizes/report`, {
    lazy: true,
    immediate: false,
});

async function initShirtData() {
    await execute();
    shirts.value = shirtsData.value.data;
    selectedContent.value = shirtsData.value.data[0];
    personsLengths.value = shirtsData.value.data.map((shirt) => shirt.persons.length) ?? [];
    sumPersonsLengths.value = personsLengths.value.reduce((acc, val) => acc + val, 0);
}
async function refreshShirtData() {
    await refresh();
    shirts.value = shirtsData.value.data;
    selectedContent.value = shirtsData.value.data[0];
    personsLengths.value = shirtsData.value.data.map((shirt) => shirt.persons.length) ?? [];
    sumPersonsLengths.value = personsLengths.value.reduce((acc, val) => acc + val, 0);
}

onMounted(async () => {
    loadingPage.value = true;
    await initShirtData();
    loadingPage.value = false;
});

async function changeSelectedTabIndex(index) {
    selectedTabIndex.value = index;
    selectedContent.value = shirts.value[index];
}
</script>
<template>
    <div v-if="!loadingPage">
        <!-- Page Title & Action Buttons -->
        <div class="md:flex md:items-center md:justify-between md:gap-5">
            <div class="flex items-center gap-2">
                <Icon name="solar:asteroid-linear" class="size-5 opacity-75" />
                <div>T-Shirts Sizes Report</div>
                <div class="bg-primary px-1.5 py-1 rounded-full aspect-1/1 text-white text-sm">{{ sumPersonsLengths }}</div>
                <div class="opacity-75 text-sm">Total</div>
            </div>
            <div class="flex items-center gap-3">
                <ConferenceSwitcher @reload="refreshShirtData" />
            </div>
        </div>
        <div v-if="shirts" class="mt-8">
            <template v-if="shirts.length > 0">
                <ul class="grid gap-5 lg:grid-cols-4 md:grid-cols-2">
                    <template v-for="(diet, index) in shirts" :key="diet.id">
                        <li :class="[selectedTabIndex === index ? 'btn-primary' : 'btn-secondary', 'btn btn-rounded justify-between']" @click="changeSelectedTabIndex(index)">
                            <div>{{ diet.name }}</div>
                            <div class="font-medium">
                                {{ diet.persons.length }}
                            </div>
                        </li>
                    </template>
                </ul>
                <div class="mt-5 bg-white rounded-xl shadow-sm p-5">
                    <ul v-if="selectedContent.persons.length > 0" class="divide-y divide-dashed divide-slate-300">
                        <li v-for="person in selectedContent.persons" :key="person.id" class="md:py-2 py-4 intro-x">
                            <div class="grid md:grid-cols-12 gap-5 items-center">
                                <div class="md:col-span-4">
                                    <div class="inline-flex text-left items-center">
                                        <img class="h-10 w-10 !rounded-full ring-2 -ring-offset-2 ring-slate-500/10 object-cover bg-white" :src="person.image_url" :alt="person.name" :title="person.name" />
                                        <div class="ml-2">
                                            <div class="truncate">{{ person.name }}</div>
                                            <div class="text-xs mt-0.5 truncate capitalize">
                                                {{ person.jobTitle ? person.jobTitle : person.type }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="md:col-span-5">
                                    <div class="inline-flex text-left items-center">
                                        <img class="h-10 w-20 !rounded-sm p-1 ring-2 -ring-offset-2 ring-slate-500/10 object-contain bg-white" :src="person.company?.image_url" :alt="person.company?.name" :title="person.company?.name" />
                                        <div class="ml-2">
                                            <div class="truncate">{{ person.company?.name }}</div>
                                            <div class="text-xs mt-0.5 truncate capitalize">
                                                <span v-if="person.company?.countryName" class="">{{ person.company?.countryName }}</span>
                                                <span v-if="person.company?.city">, {{ person.company?.city }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="md:col-span-3">
                                    <UiEventOrderStatusBadge :status-code="person.orderStatus" />
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div v-else class="italic text-center opacity-75">No persons attached for this T-Shirt Size</div>
                </div>
            </template>
            <template v-else>
                <div>No T-Shirts Sizes is selected or attached to any persons</div>
            </template>
        </div>
    </div>
    <div v-else class="flex min-h-dvh items-center place-content-center text-center">
        <div>
            <div class="opacity-75 text-sm animate-pulse">Loading...</div>
            <Icon name="eos-icons:three-dots-loading" class="size-16" />
        </div>
    </div>
</template>
