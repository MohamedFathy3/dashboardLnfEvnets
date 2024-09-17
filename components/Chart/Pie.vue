<template>
    <div class="p-5 bg-white rounded-2xl grow h-full">
        <div class="flex items-center gap-5 justify-between">
            <div class="flex items-center gap-3">
                <Icon v-if="icon" :name="icon" class="opacity-75 size-5" />
                <span v-if="sectionHeading" class="font-medium">{{ sectionHeading }}</span>
            </div>
        </div>
        <div class="mt-5">
            <Pie :data="data" :options="options" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions, type ChartData } from 'chart.js';
import { Pie } from 'vue-chartjs';

const props = defineProps({
    sectionHeading: {
        type: String,
        default: null,
    },
    icon: {
        type: String,
        default: null,
    },
    data: {
        type: Object as () => PieChartDataValues,
        required: true,
    },
});

ChartJS.register(ArcElement, Tooltip, Legend);

const options = computed<ChartOptions<'pie'>>(() => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
        },
    };
});

const data = ref<ChartData<'pie'>>({
    labels: (props.data as PieChartDataValues).label,
    datasets: [
        {
            data: (props.data as PieChartDataValues).data,
            backgroundColor: (props.data as PieChartDataValues).colors,
        },
    ],
});
</script>
