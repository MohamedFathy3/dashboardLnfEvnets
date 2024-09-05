<script setup>
definePageMeta({
    middleware: 'auth',
});
const networkInfoBoxes = ref([]);
const { data: networkStatistics, execute: fetchNetworkStatistics } = await useApiFetch('/api/dashboard/network/user-statistic', {
    immediate: false,
    lazy: true,
});
const { data: networkReports, status } = await useApiFetch('/api/dashboard/network-overview', {
    lazy: true,
});
async function prepareInfoBoxes() {
    await fetchNetworkStatistics();
    networkInfoBoxes.value = [
        {
            title: 'Approved',
            icon: 'solar:users-group-two-rounded-outline',
            value: networkStatistics.value.totalApproved,
            description: 'Members',
        },
        {
            title: 'Countries',
            icon: 'solar:earth-outline',
            value: networkStatistics.value.totalCountriesWithMembers,
            description: 'With Members',
        },
        {
            title: 'Suspended',
            icon: 'solar:user-minus-rounded-line-duotone',
            value: networkStatistics.value.totalSuspended,
            description: 'Members',
        },
        {
            title: 'Blacklisted',
            icon: 'solar:user-cross-rounded-line-duotone',
            value: networkStatistics.value.totalBlacklisted,
            description: 'Members',
        },
    ];
}
onMounted(async () => {
    await prepareInfoBoxes();
});
const userStore = useUserStore();
</script>
<template>
    <div v-if="usePermissionCheck(['network_overview_list'])" class="grid lg:grid-cols-12 gap-5">
        <div class="lg:col-span-12 text-2xl"><span class="font-light">Hello</span>, {{ userStore.user?.name }}</div>
        <UiInfoBox :data="networkInfoBoxes" />
        <div v-if="status !== 'pending'" class="lg:col-span-12 grid lg:grid-cols-12 gap-5">
            <div class="lg:col-span-8 intro-x pt-5 flex flex-col gap-5">
                <LazyApplicationExpireSoonTopFive v-if="usePermissionCheck(['network_member_list'])" :data="networkReports?.expireSoonMember" />
                <LazyApplicationLatestApplications v-if="usePermissionCheck(['network_application_list'])" :data="networkReports?.latestApplication" />
                <LazyApplicationContactMessageModal v-if="usePermissionCheck(['network_message_list'])" :data="networkReports?.latestMassages" />
            </div>
            <div class="lg:col-span-4 intro-x">
                <LazyChartTopVisitsCountry :data="networkReports?.topVisitedCountries" />
            </div>
        </div>
    </div>
</template>
