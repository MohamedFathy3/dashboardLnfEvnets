<template>
    <div>
        <div v-if="!loadingOverview" class="grid lg:grid-cols-12 gap-5">
            <UiInfoBox :data="conferenceInfoBoxes" />
            <div class="lg:col-span-6 intro-x">
                <ChartLine :chart-data-values="ordersPaymentChart.data" :total="ordersPaymentChart.total" currency :chart-labels="ordersPaymentChart.labels" :section-heading="ordersPaymentChart.sectionHeading" icon="solar:graph-outline" />
            </div>
            <div class="lg:col-span-6 intro-x">
                <ChartBar :chart-data-values="ordersCountChart.data" :total="ordersCountChart.total" :chart-labels="ordersCountChart.labels" :section-heading="ordersCountChart.sectionHeading" icon="solar:graph-outline" />
            </div>

            <div class="lg:col-span-12 intro-x">
                <ChartBarFive :chart-data-values="ordersStatusesPerMonth.data" :chart-labels="ordersStatusesPerMonth.labels" :section-heading="ordersStatusesPerMonth.sectionHeading" icon="solar:graph-outline" />
            </div>
            <div class="lg:col-span-4 intro-x">
                <ChartTopVisitsCountry :data="topVisitsCountries?.data" />
            </div>
        </div>
        <div v-else class="flex min-h-dvh items-center place-content-center text-center">
            <div>
                <div class="opacity-75 text-sm animate-pulse">Loading Conference Statistics</div>
                <Icon name="eos-icons:three-dots-loading" class="size-16" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: 'auth',
});

const loadingOverview = ref(true);
const conferenceInfoBoxes = ref<InfoBoxType[]>([]);
const ordersPaymentChart = ref();
const ordersCountChart = ref();
const ordersStatusesPerMonth = ref();

const { data: conferenceStatistics, execute: fetchConferenceStatistics } = await useApiFetch<ConferenceStatisticsBox>('/api/event/dashboard/report', {
    immediate: false,
    lazy: true,
});

const { data: paymentChart, execute: fetchingPaymentChart } = await useApiFetch<ApiResponse>('/api/event/payment/chart-per-month', {
    immediate: false,
    lazy: true,
});
const { data: ordersChart, execute: fetchingOrdersChart } = await useApiFetch<ApiResponse>('/api/event/order/count-per-month', {
    immediate: false,
    lazy: true,
});
const { data: orderStatuesChart, execute: fetchingOrderStatuesChart } = await useApiFetch<ApiResponse>('/api/event/order/count-status-month', {
    immediate: false,
    lazy: true,
});
const { data: topVisitsCountries, execute: fetchingTopVisitsCountries } = await useApiFetch<ApiResponse>('/api/event/count/visit-country', {
    immediate: false,
    lazy: true,
});

async function prepareInfoBoxes() {
    await fetchConferenceStatistics();
    conferenceInfoBoxes.value = [
        {
            title: 'Approved Payments',
            icon: 'solar:dollar-minimalistic-outline',
            value: useFormatCurrency((conferenceStatistics.value as ConferenceStatisticsBox).totalAmount),
            description: 'USD',
        },
        {
            title: 'Approved Companies',
            icon: 'solar:case-minimalistic-line-duotone',
            value: (conferenceStatistics.value as ConferenceStatisticsBox).totalApprovedCompanies,
            description: 'Companies',
        },
        {
            title: 'Approved Delegates',
            icon: 'solar:users-group-two-rounded-linear',
            value: (conferenceStatistics.value as ConferenceStatisticsBox).totalApprovedDelegates,
            description: 'Delegate',
        },
        {
            title: 'Booked Rooms',
            icon: 'solar:bed-line-duotone',
            value: (conferenceStatistics.value as ConferenceStatisticsBox).totalBookedRooms,
            description: 'Room',
        },
    ];
}
async function preparePaymentChart() {
    await fetchingPaymentChart();
    ordersPaymentChart.value = {
        sectionHeading: 'Payments',
        labels: paymentChart.value?.data?.months,
        total: paymentChart.value?.data?.total,
        data: [
            { data: paymentChart.value?.data?.months_number.member, label: 'Members' },
            { data: paymentChart.value?.data?.months_number.non_member, label: 'Non Members' },
        ],
    };
}
async function prepareOrdersChart() {
    await fetchingOrdersChart();
    ordersCountChart.value = {
        sectionHeading: 'Orders',
        labels: ordersChart.value?.data?.months,
        total: ordersChart.value?.data?.total,
        data: [
            { data: ordersChart.value?.data?.months_number.member, label: 'Members' },
            { data: ordersChart.value?.data?.months_number.non_member, label: 'Non Members' },
        ],
    };
}
async function prepareOrderStatusesPerMonthChart() {
    await fetchingOrderStatuesChart();
    ordersStatusesPerMonth.value = {
        sectionHeading: 'Orders Status Per Month',
        labels: orderStatuesChart.value?.data?.months,
        data: [
            { data: orderStatuesChart.value?.data?.months_number.in_application_form, label: 'Application Form' },
            { data: orderStatuesChart.value?.data?.months_number.pending_payment, label: 'Pending Payment' },
            { data: orderStatuesChart.value?.data?.months_number.pending_bank_transfer, label: 'Requested Bank Transfer' },
            { data: orderStatuesChart.value?.data?.months_number.approved_bank_transfer, label: 'Approved Bank Transfer' },
            { data: orderStatuesChart.value?.data?.months_number.approved_online_payment, label: 'Online Payment' },
        ],
    };
}
async function prepareTopVisits() {
    await fetchingTopVisitsCountries();
}

async function loadPageData() {
    await prepareInfoBoxes();
    await preparePaymentChart();
    await prepareOrdersChart();
    await prepareOrderStatusesPerMonthChart();
    await prepareTopVisits();
}

onMounted(async () => {
    loadingOverview.value = true;
    await loadPageData();
    loadingOverview.value = false;
});
</script>
