<script setup>
const isOpen = ref(false)
const formLoading = ref(false)

const openModal = () => {
    isOpen.value = true
    console.log(isOpen.value)
}

const closeModal = () => {
    isOpen.value = false
}







const config = useRuntimeConfig();

const appliedCatTypes = ref([]);
const categoryTypes = ref([
    { id: 'free', label: 'Free' },
    { id: 'paid', label: 'Paid' },
    { id: 'vendor', label: 'Vendor' },
    { id: 'pfs_team', label: 'PFS Team' },
    { id: 'wsa_team', label: 'WSA Team' },
]);
const initDownloadByType = async () => {
    formLoading.value = true;
    const networkUrl = config.public.apiUrl + '/export-excel/report-attendee-category';
    const categoryParam = '?category=' + encodeURIComponent(JSON.stringify(appliedCatTypes.value));
    if (appliedCatTypes.value.length > 0) {
        navigateTo(networkUrl + categoryParam, {
            external: true,
        });
    } else {
        navigateTo(networkUrl, {
            external: true,
        });
    }
    formLoading.value = false;
};

</script>
<template>
   <div>
    




    <button  class="btn btn-dark btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" type="button" @click="openModal">
        <Icon name="solar:download-outline" class="size-5 opacity-75" />
        <span>Export By Category</span>
    </button>




    <TheModal :open-modal="isOpen" size="3xl" @close-modal="isOpen = false">
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
