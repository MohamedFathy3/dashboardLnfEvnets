<script setup>
const props = defineProps({
    data: {
        type: Array,
        required: true,
        default: () => [],
    },
});
const formLoading = ref(false);
const isOpen = ref(false);
const item = ref({});
const fetchItem = async (id) => {
    const { data, error } = await useApiFetch(`/api/contactus/${id}`, {
        lazy: true,
    });
    if (data.value) {
        item.value = data.value.data;
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
};
async function closeModal() {
    isOpen.value = false;
    v$.value.$reset();
    item.value = {};
}
async function openModal(id = null) {
    formLoading.value = true;
    await fetchItem(id);
    formLoading.value = false;
    isOpen.value = true;
}
</script>

<template>
    <div>
        <div class="flex flex-col md:flex-row items-center justify-between sm:gap-5 gap-2">
            <div class="flex items-center gap-3">
                <Icon name="solar:chat-line-line-duotone" class="opacity-75 size-5" />
                <span class="font-medium">Latest Contact Messages</span>
            </div>
            <NuxtLink class="text-xs px-2 py-1 rounded-full bg-white border md:w-auto w-full text-center" href="/website-data/network-messages">View More</NuxtLink>
        </div>
        <div class="hidden md:block text-xs">
            <table class="table table-report font-light">
                <tbody>
                    <template v-if="props.data.length > 0">
                        <template v-for="row in props.data" :key="row.id">
                            <tr>
                                <td>
                                    <div class="opacity-75 font-medium">{{ row.name }}</div>
                                    <div class="mt-0.5">
                                        <span class="lowercase py-0.5 whitespace-nowrap truncate opacity-75">{{ row.email }}</span>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div class="opacity-75 font-medium">{{ row.sentSince }}</div>
                                        <div class="mt-1">
                                            <span class="py-1 whitespace-nowrap truncate opacity-75 capitalize">{{ row.createdAt }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-right">
                                    <div>
                                        <button class="btn btn-secondary btn-rounded btn-sm gap-3 size-8" @click="openModal(row.id)">
                                            <Icon name="solar:eye-outline" class="size-4 shrink-0" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </template>
                </tbody>
            </table>
        </div>
        <div v-if="props.data.length > 0" class="md:hidden flex flex-col gap-3 mt-5">
            <div v-for="row in props.data" :key="row.id" class="box p-3 text-xs">
                <div class="space-y-0.5">
                    <div class="">{{ row.name }}</div>
                    <div class="font-light truncate opacity-75">{{ row.email }}</div>
                    <div>{{ row.sentSince }}</div>
                    <div>{{ row.createdAt }}</div>
                </div>
                <button class="mt-5 w-full btn btn-secondary btn-rounded btn-sm gap-3" @click="openModal(row.id)">
                    <Icon name="solar:eye-outline" class="size-4 shrink-0" />
                </button>
            </div>
        </div>
        <TheModal :open-modal="isOpen" size="sm:5xl" @close-modal="closeModal()">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="font-medium" v-html="'View Message'"></div>
                    <Icon class="w-8 h-8 opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300" name="solar:close-square-outline" @click="closeModal" />
                </div>
            </template>
            <template #content>
                <dl>
                    <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 odd:bg-slate-100">
                        <dt class="text-sm font-light opacity-75">Name</dt>
                        <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2">
                            <div class="flex items-center">
                                <Icon name="solar:user-circle-line-duotone" class="size-5 text-slate-500 mr-2" />
                                <div>{{ item?.name }}</div>
                            </div>
                        </dd>
                    </div>
                    <div class="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 odd:bg-slate-100">
                        <dt class="text-sm font-light opacity-75">Email</dt>
                        <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2">
                            <div class="flex items-center">
                                <Icon name="solar:streets-navigation-linear" class="size-5 text-slate-500 mr-2" />
                                <div>{{ item?.email }}</div>
                            </div>
                        </dd>
                    </div>
                    <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 odd:bg-slate-100">
                        <dt class="text-sm font-light opacity-75">Phone</dt>
                        <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2">
                            <div class="flex items-center">
                                <Icon name="solar:phone-calling-linear" class="size-5 text-slate-500 mr-2" />
                                <div>{{ item?.phone }}</div>
                            </div>
                        </dd>
                    </div>
                    <div class="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 odd:bg-slate-100">
                        <dt class="text-sm font-light opacity-75">Address</dt>
                        <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2">
                            <div class="flex items-center">
                                <Icon name="solar:streets-map-point-linear" class="size-5 text-slate-500 mr-2" />
                                <div>{{ item?.address }}</div>
                            </div>
                        </dd>
                    </div>
                    <div class="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 odd:bg-slate-100">
                        <dt class="text-sm font-light opacity-75">Subject</dt>
                        <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2">
                            <div class="flex items-center">
                                <div>{{ item?.subject }}</div>
                            </div>
                        </dd>
                    </div>
                    <div class="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 odd:bg-slate-100">
                        <dt class="text-sm font-light opacity-75">Message</dt>
                        <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2">
                            {{ item?.message }}
                        </dd>
                    </div>
                    <div class="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 odd:bg-slate-100">
                        <dt class="text-sm font-light opacity-75">Submitting Date</dt>
                        <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <Icon name="solar:calendar-line-duotone" class="size-5 text-slate-500 mr-2" />
                                    {{ item?.createdAt }}
                                </div>
                                <div class="flex items-center">
                                    <Icon name="solar:watch-round-line-duotone" class="size-5 text-slate-500 mr-2" />
                                    {{ item?.sentSince }}
                                </div>
                            </div>
                        </dd>
                    </div>
                </dl>
            </template>
            <template #footer>
                <div class="w-full flex items-center justify-end gap-5">
                    <button :disabled="formLoading" class="btn-rounded btn-sm btn btn-danger px-4" type="button" @click="closeModal">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:close-circle-linear'" class="w-5 h-5 mr-2" />
                        <span>Close</span>
                    </button>
                </div>
            </template>
        </TheModal>
    </div>
</template>

<style scoped></style>
