<template>
    <div class="flex flex-col gap-5">
        <div class="md:flex md:items-center md:justify-between md:gap-5 -intro-y">
            <div class="flex items-center gap-2">
                <Icon name="solar:chart-2-outline" class="size-5 opacity-75" />
                <div>Conference Overview</div>
            </div>
            <ConferenceSwitcher @reload="fetchOverViewData" />
        </div>
        <ConferenceOldWarning />
        <div v-if="usePermissionCheck(['conference_overview_list'])">
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
                <div class="lg:col-span-6 intro-x">
                    <ChartLineSix
                        :chart-data-values="registeredCompaniesByMonthData.data"
                        :total="registeredCompaniesByMonthData.total"
                        :chart-labels="registeredCompaniesByMonthData.labels"
                        :section-heading="registeredCompaniesByMonthData.sectionHeading"
                        icon="solar:case-minimalistic-outline"
                    />
                </div>
                <div class="lg:col-span-6 intro-x">
                    <ChartPie section-heading="Approved Companies By Type" :data="membersByType" icon="solar:graph-outline" />
                </div>
                <div class="lg:col-span-6 intro-x">
                    <ChartPie section-heading="Orders Statuses By Type" :data="orderStatuses" icon="solar:graph-outline" />
                </div>
                <div class="lg:col-span-6 intro-x">
                    <ChartPie section-heading="Approved Delegates By Type" :data="approvedDelegatesByUserTypeData" icon="solar:users-group-two-rounded-outline" />
                </div>
                <div class="lg:col-span-6 intro-x">
                    <ChartTopVisitsCountry v-if="topVisitsByCountry" :data="topVisitsByCountry" />
                </div>
                <div class="lg:col-span-6 intro-x">
                    <ChartTopVisitsCountry v-if="approvedMembersCountryCount" label="Approved Members By Country" :data="approvedMembersCountryCount" />
                </div>
            </div>
            <div v-else class="flex min-h-dvh items-center place-content-center text-center">
                <div>
                    <div class="opacity-75 text-sm animate-pulse">Loading Conference Statistics</div>
                    <Icon name="eos-icons:three-dots-loading" class="size-16" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import colors from 'tailwindcss/colors';

definePageMeta({
    middleware: 'auth',
});
const { data: overview, execute: fetchOverViewData } = await useApiFetch<ConferenceOverview>('/api/event/dashboard/overview', {
    immediate: false,
    lazy: true,
});
const loadingOverview = ref(true);
const statistics = ref<DashboardReportStatus>();
const paymentsPerMonth = ref<ChartPaymentsPerMonth>();
const registeredCompaniesByMonth = ref<ChartPaymentsPerMonth>();
const ordersCountPerMonth = ref<ChartPaymentsPerMonth>();
const ordersStatusCountPerMonth = ref<ChartPaymentsPerMonth>();
const topVisitsByCountry = ref<Visit>();
const approvedMembersCountryCount = ref<Visit>();
const approvedMembersByTypeCount = ref<PieChartApiData>();
const orderStatusCount = ref<PieChartApiData>();
const approvedDelegatesByUserType = ref<PieChartApiData>();

onMounted(async () => {
    loadingOverview.value = true;
    await fetchOverViewData();
    if (overview.value) {
        statistics.value = overview.value.statistics;
        paymentsPerMonth.value = overview.value.paymentsPerMonth;
        registeredCompaniesByMonth.value = overview.value.registeredCompaniesByMonth;
        ordersCountPerMonth.value = overview.value.ordersCountPerMonth;
        ordersStatusCountPerMonth.value = overview.value.ordersStatusCountPerMonth;
        topVisitsByCountry.value = overview.value.topVisitsByCountry;
        approvedMembersCountryCount.value = overview.value.approvedMembersCountryCount;
        approvedMembersByTypeCount.value = overview.value.approvedMembersByTypeCount;
        orderStatusCount.value = overview.value.orderStatusCount;
        approvedDelegatesByUserType.value = overview.value.approvedDelegatesByUserType;
    }
    await loadPageData();
    loadingOverview.value = false;
});
// Final Preparation Data Objects
const conferenceInfoBoxes = ref();
const ordersPaymentChart = ref();
const ordersCountChart = ref();
const ordersStatusesPerMonth = ref();
const membersByType = ref();
const orderStatuses = ref();
const registeredCompaniesByMonthData = ref();
const approvedDelegatesByUserTypeData = ref();

async function prepareInfoBoxes() {
    conferenceInfoBoxes.value = [
        {
            title: 'Approved Payments',
            icon: 'solar:dollar-minimalistic-outline',
            value: useFormatCurrency((statistics.value as DashboardReportStatus).totalAmount),
            description: 'USD',
        },
        {
            title: 'Approved Companies',
            icon: 'solar:case-minimalistic-line-duotone',
            value: (statistics.value as DashboardReportStatus).totalApprovedCompanies,
            description: 'Companies',
        },
        {
            title: 'Approved Delegates',
            icon: 'solar:users-group-two-rounded-linear',
            value: (statistics.value as DashboardReportStatus).totalApprovedDelegates,
            description: 'Delegate',
        },
        {
            title: 'Booked Rooms',
            icon: 'solar:bed-line-duotone',
            value: (statistics.value as DashboardReportStatus).totalBookedRooms,
            description: 'Room',
        },
    ];
}
async function preparePaymentChart() {
    ordersPaymentChart.value = {
        sectionHeading: 'Payments',
        labels: paymentsPerMonth.value?.months,
        total: paymentsPerMonth.value?.total,
        data: [
            { data: paymentsPerMonth.value?.months_number.member, label: 'Members' },
            { data: paymentsPerMonth.value?.months_number.non_member, label: 'Non Members' },
        ],
    };
}
async function prepareRegCompaniesByMonthChart() {
    registeredCompaniesByMonthData.value = {
        sectionHeading: 'All Registered Companies By Types',
        labels: registeredCompaniesByMonth.value?.months,
        total: registeredCompaniesByMonth.value?.total,
        data: [
            { data: registeredCompaniesByMonth.value?.months_number.member, label: 'Members' },
            { data: registeredCompaniesByMonth.value?.months_number.non_member, label: 'Non Members' },
            { data: registeredCompaniesByMonth.value?.months_number.founder, label: 'Founder' },
            { data: registeredCompaniesByMonth.value?.months_number.vendor, label: 'Vendor' },
            { data: registeredCompaniesByMonth.value?.months_number.wsa_team, label: 'WSA Team' },
            { data: registeredCompaniesByMonth.value?.months_number.partner, label: 'Partner' },
        ],
    };
}
async function prepareOrdersChart() {
    ordersCountChart.value = {
        sectionHeading: 'Approved Orders',
        labels: ordersCountPerMonth.value?.months,
        total: ordersCountPerMonth.value?.total,
        data: [
            { data: ordersCountPerMonth.value?.months_number.member, label: 'Members' },
            { data: ordersCountPerMonth.value?.months_number.non_member, label: 'Non Members' },
        ],
    };
}
async function prepareOrderStatusesPerMonthChart() {
    ordersStatusesPerMonth.value = {
        sectionHeading: 'Orders Status Per Month',
        labels: ordersStatusCountPerMonth.value?.months,
        data: [
            { data: ordersStatusCountPerMonth.value?.months_number.in_application_form, label: 'Application Form' },
            { data: ordersStatusCountPerMonth.value?.months_number.pending_payment, label: 'Pending Payment' },
            { data: ordersStatusCountPerMonth.value?.months_number.pending_bank_transfer, label: 'Requested Bank Transfer' },
            { data: ordersStatusCountPerMonth.value?.months_number.approved_bank_transfer, label: 'Approved Bank Transfer' },
            { data: ordersStatusCountPerMonth.value?.months_number.approved_online_payment, label: 'Online Payment' },
        ],
    };
}
async function prepareMembersByTypePieChart() {
    membersByType.value = {
        label: approvedMembersByTypeCount.value?.label,
        colors: [colors.blue[900], colors.yellow[500], colors.orange[300], colors.red[600]],
        data: approvedMembersByTypeCount.value?.data,
    };
}
async function prepareOrdersByStatusPieChart() {
    orderStatuses.value = {
        label: orderStatusCount.value?.label,
        colors: [colors.slate[300], colors.slate[500], colors.yellow[300], colors.green[500], colors.green[600]],
        data: orderStatusCount.value?.data,
    };
}
async function prepareApprovedDelegatesByUserTypePieChart() {
    approvedDelegatesByUserTypeData.value = {
        label: approvedDelegatesByUserType.value?.label,
        colors: [colors.green[500], colors.blue[900], colors.slate[400], colors.red[500], colors.orange[300], colors.yellow[600]],
        data: approvedDelegatesByUserType.value?.data,
    };
}
async function loadPageData() {
    await prepareInfoBoxes();
    await preparePaymentChart();
    await prepareOrdersChart();
    await prepareOrderStatusesPerMonthChart();
    await prepareMembersByTypePieChart();
    await prepareOrdersByStatusPieChart();
    await prepareRegCompaniesByMonthChart();
    await prepareApprovedDelegatesByUserTypePieChart();
}
</script>
