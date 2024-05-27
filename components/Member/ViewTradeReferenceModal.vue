<script setup>
const props = defineProps({
    reference: {
        type: Object,
        default: () => {},
    },
    open: {
        required: false,
        type: Boolean,
    },
});

const emit = defineEmits(['close']);

async function closeModal() {
    emit('close');
}
</script>
<template>
    <TheModal :open-modal="props.open" size="5xl" @close-modal="closeModal()">
        <template #header>
            <div class="flex justify-between items-center">
                <div class="font-medium" v-html="'View Trade Reference Details'"></div>
                <Icon class="w-8 h-8 opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300" name="solar:close-square-outline" @click="closeModal" />
            </div>
        </template>
        <template #content>
            <ul class="divide-y !divide-slate-100 font-light">
                <li class="grid lg:grid-cols-12 gap-5 py-1.5">
                    <div class="lg:col-span-3 opacity-75 font-medium">Company</div>
                    <div class="lg:col-span-9">{{ props.reference.name }}</div>
                </li>
                <li class="grid lg:grid-cols-12 gap-5 py-1.5">
                    <div class="lg:col-span-3 opacity-75 font-medium">Country</div>
                    <div class="lg:col-span-9 flex items-center gap-1.5">
                        <NuxtImg :src="props.reference.country.imageUrl" :alt="props.reference.country.name" :title="props.reference.country.name" class="w-6 h-4 object-contain" />
                        <div class="font-light">{{ props.reference?.country?.name }}</div>
                        <div class="font-light">{{ props.reference?.city }}</div>
                    </div>
                </li>
                <li class="grid lg:grid-cols-12 gap-5 py-1.5">
                    <div class="lg:col-span-3 opacity-75 font-medium">Person</div>
                    <div class="lg:col-span-9">{{ props.reference.person }}</div>
                </li>
                <li class="grid lg:grid-cols-12 gap-5 py-1.5">
                    <div class="lg:col-span-3 opacity-75 font-medium">Job title</div>
                    <div class="lg:col-span-9">{{ props.reference.jobTitle }}</div>
                </li>
                <li class="grid lg:grid-cols-12 gap-5 py-1.5">
                    <div class="lg:col-span-3 opacity-75 font-medium">Email</div>
                    <div class="lg:col-span-9">{{ props.reference.email }}</div>
                </li>
            </ul>
        </template>
        <template #footer>
            <div class="w-full flex items-center justify-end gap-5">
                <button class="btn-rounded btn-sm btn btn-danger px-4" type="button" @click="closeModal">
                    <Icon name="solar:close-circle-linear" class="w-5 h-5 mr-2" />
                    <span>Close</span>
                </button>
            </div>
        </template>
    </TheModal>
</template>
