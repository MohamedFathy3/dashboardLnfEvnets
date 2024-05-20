<template>
    <div class="grid lg:grid-cols-12 gap-5">
        <UiInfoBox :data="networkInfoBoxes" />
        <div class="lg:col-span-6">
            <ChartLine :chart-data-values="ordersPaymentChart.data" :chart-labels="ordersPaymentChart.labels" :section-heading="ordersPaymentChart.sectionHeading" icon="solar:graph-outline" />
        </div>
        <div class="lg:col-span-6">
            <ChartBar :chart-data-values="ordersCountChart.data" :chart-labels="ordersCountChart.labels" :section-heading="ordersCountChart.sectionHeading" icon="solar:graph-outline" />
        </div>

        <div class="lg:col-span-12">
            <ChartBarFive :chart-data-values="ordersStatusesPerMonth.data" :chart-labels="ordersStatusesPerMonth.labels" :section-heading="ordersStatusesPerMonth.sectionHeading" icon="solar:graph-outline" />
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: 'auth',
});
function generateRandomData(length: number, min: number, max: number) {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}
const networkInfoBoxes = ref([
    {
        title: 'Approved',
        icon: 'solar:users-group-two-rounded-outline',
        value: 67,
        description: 'Members',
    },
    {
        title: 'Countries',
        icon: 'solar:earth-outline',
        value: 49,
        description: 'With Members',
    },
    {
        title: 'Suspended',
        icon: 'solar:user-minus-rounded-line-duotone',
        value: 50,
        description: 'Members',
    },
    {
        title: 'Blacklisted',
        icon: 'solar:user-cross-rounded-line-duotone',
        value: 0,
        description: 'Members',
    },
]);
const ordersCountChart = ref({
    sectionHeading: 'Orders Count',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    data: [
        { data: [5, 10, 15, 20, 25, 5, 10, 15, 20, 25, 51, 35], label: 'Members' },
        { data: [5, 10, 15, 20, 25, 5, 10, 15, 20, 25, 51, 35], label: 'Non Members' },
    ],
});
const ordersPaymentChart = ref({
    sectionHeading: 'Payments',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    data: [
        { data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10, 11], label: 'Members' },
        { data: [5, 10, 15, 20, 25, 5, 10, 15, 20, 25, 49, 35], label: 'Non Members' },
    ],
});
const ordersStatusesPerMonth = ref({
    sectionHeading: 'Orders Status Per Month',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    data: [
        { data: generateRandomData(12, 1, 20), label: 'Application Form' },
        { data: generateRandomData(12, 5, 50), label: 'Pending Payment' },
        { data: generateRandomData(12, 1, 20), label: 'Requested Bank Transfer' },
        { data: generateRandomData(12, 5, 50), label: 'Approved Bank Transfer' },
        { data: generateRandomData(12, 5, 50), label: 'Online Payment' },
    ],
});
</script>
