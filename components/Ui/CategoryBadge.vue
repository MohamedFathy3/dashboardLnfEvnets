<script lang="ts" setup>
const props = defineProps({
    data: {
        type: String,
        default: null,
        required: true,
    },
});

const membershipStatues = ref([
    { name: 'Free', value: 'free' },
    { name: 'Paid', value: 'paid' },
    { name: 'PFS Team', value: 'pfs_team' },
    { name: 'Vendor', value: 'vendor' },
    { name: 'WSA Team', value: 'wsa_team' },
]);

const elementStyle = computed(() => {
    if (props.data && membershipStatues.value.some((type) => type.value === props.data)) {
        const type = props.data;
        switch (type) {
            case 'paid':
                return 'bg-success/25 text-green-700 border !border-success/25';
            case 'wsa_team':
                return 'bg-yellow-100 text-yellow-700 border !border-yellow-200';
            case 'pfs_team':
                return 'bg-yellow-100 text-yellow-700 border !border-yellow-200';
            case 'vendor':
                return 'bg-slate-100 text-slate-700 border !border-slate-200';
            default:
                return 'bg-slate-100 text-slate-700 border !border-slate-200';
        }
    } else {
        return '';
    }
});
</script>

<template>
    <span :class="elementStyle" class="text-xs font-medium py-[0.23rem] px-2 rounded-full">{{ membershipStatues.find((t) => t.value === props.data)?.name }}</span>
</template>
