<script setup>
const props = defineProps({
    certificates: {
        required: true,
        type: Array,
        default: () => [],
    },
});

const resources = useResourceStore();
</script>
<template>
    <div class="bg-white rounded-xl p-5 shadow-sm">
        <div class="flex items-center justify-between gap-5 pb-3 border-b">
            <div class="font-medium flex items-center gap-1.5">
                <Icon name="solar:medal-ribbon-star-linear" class="size-5 opacity-75" />
                Certificates
            </div>
        </div>
        <ul class="pt-3 flex flex-wrap gap-1">
            <li v-for="certificate in props.certificates" :key="certificate" class="">
                <div class="text-sm font-normal py-[0.23rem] rounded-full bg-slate-100 px-3 flex items-center gap-1.5">
                    <Icon name="solar:check-read-outline" class="size-4 text-success" />
                    <span>{{ resources?.certificates.find((c) => c.id === certificate)?.name }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>
