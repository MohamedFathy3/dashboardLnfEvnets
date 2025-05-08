<script lang="ts" setup>

const props = defineProps({
    status: {
        type: String,
        default: null,
        required: true,
    },
});

const statueses = ref([
    { name: 'Open', value: 'open', style: 'bg-green-100 text-green-700 border !border-green-200' },
    { name: 'Pending', value: 'pending', style: 'bg-gray-100 text-gray-700 border !border-gray-200' },
    { name: 'Closed', value: 'closed', style: 'bg-red-100 text-red-700 border !border-red-200' },
    { name: 'Postponed', value: 'postponed', style: 'bg-orange-100 text-orange-700 border !border-orange-200' },
]);

const elementStyle = computed(() => {
    const status = statueses.value.find((t) => t.value === props.status);
    return status ? status.style : 'bg-slate-100 text-slate-700';
});
</script>

<template>
  <span
    :class="elementStyle"
    class="text-xs font-medium py-[0.23rem] px-3 rounded-full"
  >
    {{ statueses.find((t) => t.value === props.status)?.name || 'Pending' }}
  </span>
</template>
