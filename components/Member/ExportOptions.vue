<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        type: string;
    }>(),
    {
        type: 'event',
    },
);
const appliedCatTypes = ref([]);
const config = useRuntimeConfig();
type CategoryOptions = {
    id: string;
    label: string;
};
const categoryTypes = ref<CategoryOptions[]>([
    { id: 'free', label: 'Free' },
    { id: 'paid', label: 'Paid' },
    { id: 'vendor', label: 'Vendor' },
    { id: 'pfs_team', label: 'PFS Team' },
    { id: 'wsa_team', label: 'WSA Team' },
]);
const initDownloadByType = async () => {
    formLoading.value = true;
    const isEvent = props.type == 'event';
    const eventUrl = config.public.apiUrl + '/export-excel/report-attendee-category';
    const networkUrl = config.public.apiUrl + '/export-excel/report-member-category';
    const categoryParam = '?category=' + encodeURIComponent(JSON.stringify(appliedCatTypes.value));
    if (appliedCatTypes.value.length > 0) {
        navigateTo((isEvent ? eventUrl : networkUrl) + categoryParam, {
            external: true,
        });
    } else {
        navigateTo(isEvent ? eventUrl : networkUrl, {
            external: true,
        });
    }
    formLoading.value = false;
};
const isOpen = ref(false);

const formLoading = ref(true);
function closeModal() {
    formLoading.value = false;
    isOpen.value = false;
}
function openModal() {
    isOpen.value = true;
    formLoading.value = false;
}
</script>
<template>
    <div class="flex items-center gap-3">
        <HeadlessMenu as="div" class="relative inline-block">
            <HeadlessMenuButton>
                <button type="button" class="btn btn-dark btn-rounded btn-sm w-full justify-between gap-3">
                    <span>Export Options</span>
                    <Icon class="size-5 opacity-75 hover:scale-105 transition-all" name="solar:download-outline" />
                </button>
            </HeadlessMenuButton>
            <TransitionExpand>
                <HeadlessMenuItems as="div" class="absolute text-sm right-0 mt-3 w-64 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-slate-600 z-50">
                    <ul class="p-1">
                        <HeadlessMenuItem as="a" class="py-1 grow" :href="config.public.apiUrl + '/export-excel/report-attendee/export'" target="_blank">
                            <div class="flex items-center gap-3 px-2 py-1.5 cursor-pointer hover:bg-slate-100 rounded-full transition-all">
                                <Icon name="solar:list-check-line-duotone" class="size-5 opacity-75" />
                                <div class="flex items-center justify-between gap-5 grow">
                                    <div>Export Attendees</div>
                                    <div class="text-xs py-0.5 px-3 border bg-slate-200 rounded-full">All</div>
                                </div>
                            </div>
                        </HeadlessMenuItem>
                        <HeadlessMenuItem as="li" type="button" class="py-1 grow" @click="openModal()">
                            <div class="flex items-center gap-3 px-2 py-1.5 cursor-pointer hover:bg-slate-100 rounded-full transition-all">
                                <Icon name="solar:bookmark-opened-outline" class="size-5 opacity-75" />
                                <span>Export By Category</span>
                            </div>
                        </HeadlessMenuItem>
                    </ul>
                </HeadlessMenuItems>
            </TransitionExpand>
        </HeadlessMenu>
        <TheModal :open-modal="isOpen" size="3xl" @close-modal="closeModal()">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="font-medium" v-html="'Please choose the categories you want to download'"></div>
                    <Icon class="w-8 h-8 opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300" name="solar:close-square-outline" @click="closeModal" />
                </div>
            </template>
            <template #content>
                <fieldset class="px-4 grid lg:grid-cols-3 sm:grid-cols-2 gap-6 grid-cols-1 duration-300 ease-in-out">
                    <div v-for="option in categoryTypes" :key="option.id" class="relative flex items-start">
                        <div class="flex items-center h-6">
                            <input
                                :id="option.id"
                                v-model="appliedCatTypes"
                                :checked="appliedCatTypes.includes(option.id)"
                                :aria-describedby="option.id + '-description'"
                                :name="option.id"
                                :value="option.id"
                                type="checkbox"
                                class="focus:ring-primary h-5 w-5 rounded text-primary border-slate-500 disabled:read-only:opacity-50 disabled:read-only:cursor-not-allowed"
                            />
                        </div>
                        <div class="ml-3 text-sm">
                            <label :class="['disabled:read-only:opacity-25']" :for="option.id" class="font-sm ease-in-out duration-150">
                                {{ option.label }}
                            </label>
                        </div>
                    </div>
                </fieldset>
            </template>
            <template #footer>
                <div class="w-full flex items-center justify-end gap-5">
                    <button :disabled="formLoading" class="btn-rounded btn-sm btn btn-danger px-4" type="button" @click="closeModal">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:close-circle-linear'" class="w-5 h-5 mr-2" />
                        <span>Close</span>
                    </button>
                    <button :disabled="formLoading" class="btn-rounded btn-sm btn btn-primary px-4" type="button" @click="initDownloadByType()">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:check-circle-broken'" class="w-5 h-5 mr-2" />
                        <span v-html="'Download'" />
                    </button>
                </div>
            </template>
        </TheModal>
    </div>
</template>
