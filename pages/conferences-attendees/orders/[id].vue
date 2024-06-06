<script setup>
const route = useRoute();
definePageMeta({
    middleware: 'auth',
});
const orderStatus = ref('in_application_form');
const showOrderBreakout = ref(false);
const delegatesCount = ref(0);
const spousesCount = ref(0);
const itemsCount = ref(0);
const roomsCount = ref(0);
const orderTabs = ref([
    { name: 'Delegates', count: delegatesCount, value: 'delegates' },
    { name: 'Spouses', count: spousesCount, value: 'spouses' },
    { name: 'Sponsorship Items', count: itemsCount, value: 'sponsorship-items' },
    { name: 'Rooms', count: roomsCount, value: 'rooms' },
]);
const membershipTypesList = ref([
    { name: 'Member', value: 'member' },
    { name: 'Non Member', value: 'non_member' },
    { name: 'Founder', value: 'founder' },
    { name: 'Partner', value: 'partner' },
    { name: 'Vendor', value: 'vendor' },
    { name: 'WSA Team', value: 'wsa_team' },
]);

const selectedTab = ref('delegates');
const {
    data: order,
    pending,
    refresh,
} = await useApiFetch(`/api/dashboard/order/${route.params.id}`, {
    lazy: true,
    transform: (order) => order.data,
});
const orderStatuses = ref([
    { name: 'Application Form', value: 'in_application_form' },
    { name: 'Pending Payment', value: 'pending_payment' },
    { name: 'Pending Bank Transfer', value: 'pending_bank_transfer' },
    { name: 'Approved Online Payment', value: 'approved_online_payment' },
    { name: 'Approved Bank Transfer', value: 'approved_bank_transfer' },
]);
function setCurrentTab(id) {
    selectedTab.value = id;
}
function showOrderDetails() {
    showOrderBreakout.value = !showOrderBreakout.value;
}

async function changeOrderStatus(id, statusCode) {
    const { data, error } = await useApiFetch(`/api/dashboard/order/${id}/change-status`, {
        lazy: true,
        body: { status: statusCode },
        method: 'POST',
    });
    if (data.value) {
        useToast({ title: 'Success', message: 'Status Changed Successfully', type: 'success', duration: 5000 });
    }
    if (error && error.value) {
        console.error(error);
        useToast({ title: 'Error', message: error.value.message, type: 'error', duration: 5000 });
    }
}
const getDaysAndNightsValues = (datesArray) => {
    if (datesArray.length !== 2) {
        return 'Invalid dates array. Please provide exactly two dates.';
    }

    // Parse dates in the format 'DD-MM-YYYY'
    const [startDay, startMonth, startYear] = datesArray[0].split('-').map(Number);
    const [endDay, endMonth, endYear] = datesArray[1].split('-').map(Number);

    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return "Invalid date format. Please provide dates in the format 'DD-MM-YYYY'.";
    }

    const timeDifference = endDate.getTime() - startDate.getTime();
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const nights = Math.ceil(timeDifference / millisecondsPerDay); // Adjusted to include the last day
    const days = nights + 1; // Nights excluding the last day

    return `${nights} Nights and ${days} Days`;
};
</script>
<template>
    <div v-if="order" class="flex flex-col gap-5">
        <div class="flex flex-col gap-5">
            <!-- Page Title & Action Buttons -->
            <div class="lg:flex lg:items-center lg:justify-between lg:gap-5">
                <div class="flex items-center gap-2">
                    <Icon name="solar:buildings-outline" class="size-5 opacity-75" />
                    <div>{{ order.uuid }}</div>
                </div>
                <ConferenceOrderStatusSwitch :order-id="order.id" :order-status="order.status" @reload="refresh" />
            </div>
        </div>
        <div>
            <div class="grid lg:grid-cols-12 gap-5 text-sm font-light items-start">
                <div class="bg-white shadow-sm p-5 rounded-xl lg:col-span-4 flex items-center place-content-center h-full">
                    <NuxtImg class="w-full h-24 flex items-center my-auto object-contain hover:scale-105 ease-in-out duration-300" :src="order.company.imageUrl" :alt="order.company.name" :title="order.company.name" />
                </div>
                <div class="bg-white shadow-sm p-5 rounded-xl lg:col-span-8">
                    <div class="font-medium text-base opacity-75">
                        <div class="line-clamp-1">{{ order.company.name }}</div>
                        <div class="font-light text-sm mt-0.5 lowercase hover:text-warning cursor-pointer transition-all" @click="useClipboard(order.company.email.toLowerCase())">{{ order.company.email.toLowerCase() }}</div>
                    </div>
                    <div class="border-t mt-1.5 pt-1.5 border-dashed">
                        <div class="flex items-center line-clamp-1 whitespace-nowrap">
                            <NuxtImg :src="order.company.countryFlag" :alt="order.company.countryName" :title="order.company.countryName" class="w-6 h-4 mr-2 object-contain" />
                            <div v-if="order.company.countryName" class="font-medium opacity-75">{{ order.company.countryName }}</div>
                            <div v-if="order.company.state" class="opacity-75 truncate">, {{ order.company.state }}</div>
                            <div v-if="order.company.city" class="opacity-75 truncate">, {{ order.company.city }}</div>
                        </div>
                        <div class="mt-1.5 pt-1.5 border-t border-dashed opacity-75">
                            <span v-if="order.company.addressLine1">{{ order.company.addressLine1 }}</span>
                            <span v-if="order.company.addressLine2">, {{ order.company.addressLine2 }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-white p-5 mt-5 rounded-lg border-2 border-dashed">
                <div v-if="!order.packageId" class="text-center text-slate-500 italic">No Package for this order</div>
                <template v-else>
                    <div
                        :class="[
                            order.package.style === 'gold' ? ' bg-amber-300' : '',
                            order.package.style === 'platinum' ? ' bg-slate-100' : '',
                            order.package.style === 'silver' ? ' bg-slate-200' : '',
                            'p-8 font-medium text-base rounded-lg text-center',
                        ]"
                    >
                        {{ order.package.name }}
                    </div>
                </template>
            </div>
            <div class="mt-5">
                <div>
                    <ul :class="['grid grid-cols-4 items-center gap-3 box p-1.5 !rounded-full font-medium']">
                        <li
                            v-for="tab in orderTabs"
                            :key="tab.value"
                            :class="[selectedTab === tab.value ? 'bg-primary text-white' : 'bg-slate-100', 'px-3 py-1.5 rounded-full cursor-pointer text-center flex items-center justify-between gap-3']"
                            @click="setCurrentTab(tab.value)"
                        >
                            <div>{{ tab.name }}</div>
                            <div :class="[selectedTab === tab.value ? ' bg-white text-primary' : 'text-white bg-primary/50', 'ml-2 font-semibold px-2 text-xs py-1 rounded-full']">{{ tab.count }}</div>
                        </li>
                    </ul>
                </div>
                <div v-if="selectedTab === 'delegates'" class="mt-3 box !bg-opacity-50 p-5">
                    <ul v-if="order.delegates.length > 0" class="grid xl:grid-cols-2 grid-cols-1 gap-5">
                        <li v-for="delegate in order.delegates" :key="delegate.id" class="group w-full p-5 intro-y box shadow-sm !bg-white ease-in-out duration-300 rounded-lg">
                            <div class="flex items-center pb-3 border-b w-full">
                                <div v-if="delegate.imageUrl" class="shrink-0 h-16 w-16 mr-3 ring-4 !ring-slate-500/25 overflow-hidden rounded-md">
                                    <img class="h-16 w-16 rounded-md ring-2 -ring-offset-2 ring-slate-500/10 group-hover:scale-110 ease-in-out duration-700 object-cover bg-white" :src="delegate.imageUrl" :alt="delegate.name" :title="delegate.name" />
                                </div>
                                <div>
                                    <div class="font-semibold">
                                        <span>{{ delegate.name }}</span>
                                    </div>
                                    <div class="dark:font-light flex items-center gap-5 mt-1">
                                        <div class="inline-flex items-center">
                                            <Icon name="solar:case-minimalistic-outline" class="size-4 mr-2 dark:opacity-60 opacity-80" />
                                            {{ delegate.jobTitle }}
                                        </div>
                                    </div>
                                    <div class="dark:font-light flex items-center gap-5 mt-1">
                                        <div class="inline-flex items-center">
                                            <Icon name="solar:streets-navigation-outline" class="size-4 mr-2 dark:opacity-60 opacity-80" />
                                            {{ delegate.email }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-3 divide-y divide-dashed">
                                <div class="dark:font-light grid md:grid-cols-3 grid-cols-1 gap-5 items-start pb-2">
                                    <div class="flex items-center gap-5 justify-between w-full">
                                        <div class="flex items-center">
                                            <Icon name="solar:phone-calling-rounded-linear" class="size-4 mr-2 dark:opacity-60 opacity-80" />
                                            <span>Phone</span>
                                        </div>
                                    </div>
                                    <div class="font-medium md:col-span-2">
                                        <span class="mr-1.5">+{{ delegate.phoneKey }}</span>
                                        <span>{{ delegate.phone }}</span>
                                    </div>
                                </div>
                                <div class="dark:font-light grid grid-cols-3 gap-5 items-start py-2">
                                    <div class="flex items-center gap-5 justify-between w-full">
                                        <div class="flex items-center">
                                            <Icon name="solar:smartphone-outline" class="size-4 mr-2 dark:opacity-60 opacity-80" />
                                            <span>Cell</span>
                                        </div>
                                    </div>
                                    <div class="font-medium md:col-span-2">
                                        <span class="mr-1.5">+{{ delegate.cellKey }}</span>
                                        <span>{{ delegate.cell }}</span>
                                    </div>
                                </div>
                                <div class="dark:font-light grid grid-cols-3 gap-5 items-start py-2">
                                    <div class="flex items-center gap-5 justify-between w-full">
                                        <div class="flex items-center">
                                            <Icon name="solar:user-circle-outline" class="size-4 mr-2 dark:opacity-60 opacity-80" />
                                            <span>Tshirt Size</span>
                                        </div>
                                    </div>
                                    <div class="font-medium md:col-span-2">
                                        <span>{{ delegate.tshirtSize }}</span>
                                    </div>
                                </div>
                                <div class="dark:font-light grid grid-cols-3 gap-5 items-start py-2">
                                    <div class="flex items-center gap-5 justify-between w-full">
                                        <div class="flex items-center">
                                            <Icon name="fluent:food-24-regular" class="size-4 mr-2 dark:opacity-60 opacity-80" />
                                            <span>Dietaries</span>
                                        </div>
                                    </div>
                                    <div class="font-medium md:col-span-2 flex items-center flex-wrap gap-1.5">
                                        <span v-for="(dietary, idx) in delegate.dietaries" :key="idx" class="bg-slate-200/75 dark:bg-slate-800 capitalize rounded-full px-3 py-0.5">
                                            {{ dietary.name }}
                                        </span>
                                        <span v-if="delegate.extraDietaries" class="bg-slate-200/75 dark:bg-slate-800 capitalize rounded-full px-3 py-0.5">{{ delegate.extraDietaries }}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div v-else class="text-center mt-8 text-base mb-4">
                        <div>No delegates for this order</div>
                    </div>
                </div>
                <div v-if="selectedTab === 'spouses'" class="mt-3 box !bg-opacity-50 p-5">
                    <ul v-if="order.spouses.length > 0" class="grid xl:grid-cols-2 grid-cols-1 gap-5">
                        <li v-for="spouse in order.spouses" :key="spouse.id" class="group w-full p-5 intro-y box shadow-sm !bg-white ease-in-out duration-300 rounded-lg">
                            <div class="flex items-center pb-3 border-b w-full">
                                <div v-if="spouse.imageUrl" class="shrink-0 h-8 w-8 mr-3 ring-4 !ring-slate-500/25 overflow-hidden rounded-md">
                                    <img class="h-8 w-8 rounded-md ring-2 -ring-offset-2 ring-slate-500/10 group-hover:scale-110 ease-in-out duration-700 object-cover bg-white" :src="spouse.imageUrl" :alt="spouse.name" :title="spouse.name" />
                                </div>
                                <div>
                                    <div class="font-semibold">{{ spouse.name }}</div>
                                    <div class="text-xs">
                                        Belong to: <span class="font-medium opacity-75">{{ spouse.delegate.name }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-3 divide-y divide-dashed">
                                <div class="dark:font-light grid grid-cols-3 gap-5 items-start py-2">
                                    <div class="flex items-center gap-5 justify-between w-full">
                                        <div class="flex items-center">
                                            <Icon name="solar:user-circle-outline" class="size-4 mr-2 dark:opacity-60 opacity-80" />
                                            <span>Tshirt Size</span>
                                        </div>
                                    </div>
                                    <div class="font-medium md:col-span-2">
                                        <span>{{ spouse.tshirtSize }}</span>
                                    </div>
                                </div>
                                <div class="dark:font-light grid grid-cols-3 gap-5 items-start py-2">
                                    <div class="flex items-center gap-5 justify-between w-full">
                                        <div class="flex items-center">
                                            <Icon name="fluent:food-24-regular" class="size-4 mr-2 dark:opacity-60 opacity-80" />
                                            <span>Dietaries</span>
                                        </div>
                                    </div>
                                    <div class="font-medium md:col-span-2 flex items-center flex-wrap gap-1.5">
                                        <span v-for="(dietary, idx) in spouse.dietaries" :key="idx" class="bg-slate-200/75 dark:bg-slate-800 capitalize rounded-full px-3 py-0.5">
                                            {{ dietary.name }}
                                        </span>
                                        <span v-if="spouse.extraDietaries" class="bg-slate-200/75 dark:bg-slate-800 capitalize rounded-full px-3 py-0.5">{{ spouse.extraDietaries }}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div v-else class="text-center mt-8 text-base mb-4">
                        <div>No spouses for this order</div>
                    </div>
                </div>
                <div v-if="selectedTab === 'sponsorship-items'" class="mt-3 box !bg-opacity-50 p-5">
                    <ul v-if="order.sponsorshipItems.length > 0" class="grid xl:grid-cols-2 grid-cols-1 gap-5">
                        <li v-for="item in order.sponsorshipItems" :key="item.id" class="group w-full p-5 intro-y box shadow-sm !bg-white ease-in-out duration-300 rounded-lg">
                            <div class="flex items-center pb-3 w-full">
                                <div v-if="item.imageUrl" class="shrink-0 h-12 w-12 mr-3 ring-4 !ring-slate-500/25 overflow-hidden rounded-md">
                                    <img class="h-12 w-12 rounded-md ring-2 -ring-offset-2 ring-slate-500/10 group-hover:scale-110 ease-in-out duration-700 object-cover bg-primary p-1.5" :src="item.imageUrl" :alt="item.name" :title="item.name" />
                                </div>
                                <div>
                                    <div class="font-semibold">
                                        <span>{{ item.name }}</span>
                                    </div>
                                    <div>
                                        <span class="font-medium mr-1.5">{{ item.priceUsed }}</span>
                                        <span>USD</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div v-else class="text-center mt-8 text-base mb-4">
                        <div>No spouses for this order</div>
                    </div>
                </div>
                <div v-if="selectedTab === 'rooms'" class="mt-3 box !bg-opacity-50 p-5">
                    <ul v-if="order.rooms.length > 0" class="grid xl:grid-cols-2 grid-cols-1 gap-5">
                        <li v-for="room in order.rooms" :key="room.id" class="group w-full p-5 intro-y box shadow-sm !bg-white ease-in-out duration-300 rounded-lg">
                            <div class="flex items-center pb-3 w-full">
                                <div v-if="room.room.imageUrl" class="shrink-0 h-16 w-24 mr-3 ring-4 !ring-slate-500/25 overflow-hidden rounded-md">
                                    <img
                                        class="h-16 w-24 rounded-md ring-2 -ring-offset-2 ring-slate-500/10 group-hover:scale-110 ease-in-out duration-700 object-cover bg-primary"
                                        :src="room.room.imageUrl"
                                        :alt="room.room.name"
                                        :title="room.room.name"
                                    />
                                </div>
                                <div>
                                    <div class="font-medium flex items-center">
                                        <div>{{ room.room.name }}</div>
                                        <div class="capitalize text-xs py-0.5 px-1.5 bg-slate-200 ml-2 rounded-md">{{ room.room.type }}</div>
                                    </div>
                                    <div class="mt-0.5">
                                        <span class="font-medium">{{ room.startDateFormatted }}</span>
                                        <span class="mx-2 font-light">to</span>
                                        <span class="font-medium">{{ room.endDateFormatted }}</span>
                                    </div>
                                    <div class="font-medium mt-0.5">
                                        <span>{{ room.totalPrice }}</span>
                                        <span class="font-light ml-1.5">USD</span>
                                    </div>
                                </div>
                            </div>
                            <ul class="mt-3 grid sm:grid-cols-2 pt-5 border-t">
                                <li v-for="person in room.persons" :key="person.id" class="flex items-center">
                                    <div v-if="person.imageUrl" class="shrink-0 h-12 w-12 mr-3 ring-4 !ring-slate-500/25 overflow-hidden rounded-md">
                                        <img class="h-12 w-12 rounded-md ring-2 -ring-offset-2 ring-slate-500/10 group-hover:scale-110 ease-in-out duration-700 object-cover bg-primary" :src="person.imageUrl" :alt="person.name" :title="person.name" />
                                    </div>
                                    <div>
                                        <div class="font-medium flex items-center">
                                            <div>{{ person.name }}</div>
                                        </div>
                                        <div class="capitalize">{{ person.type }}</div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <div v-else class="text-center mt-8 text-base mb-4">
                        <div>No rooms for this order</div>
                    </div>
                </div>
            </div>
            <div :class="[order.coupon ? 'border-success' : '', 'bg-white p-5 mt-5 rounded-xl border-2 border-dashed']">
                <div v-if="!order.coupon" class="text-center text-slate-500 italic">No Discount Coupon</div>
                <div v-else class="flex items-center flex-wrap justify-between text-lg">
                    <div class="font-medium">{{ order.coupon.code }}</div>
                    <div>
                        <span>{{ order.coupon.discountType === 'percentage' ? '' : '-' }}</span>
                        <span class="px-0.5 font-medium">{{ order.coupon.discountValue }}</span>
                        <span>{{ order.coupon.discountType === 'percentage' ? '%' : '' }}</span>
                    </div>
                </div>
            </div>
            <div class="mt-5">
                <div class="font-medium text-base mb-3">Order Breakdown</div>
                <div>
                    <div
                        :class="[showOrderBreakout ? '!ring-2 ring-offset-2 !ring-primary/50' : '', 'cursor-pointer group w-full p-3 intro-y bg-white border dark:!bg-slate-800/25 dark:hover:!bg-slate-800/50 ease-in-out duration-300 rounded-xl']"
                        @click="showOrderDetails"
                    >
                        <div class="flex items-center justify-between gap-5 w-full">
                            <div>
                                <div class="font-semibold">{{ order.uuid }}</div>
                                <div class="text-xs mt-1">{{ order.updatedAt }}</div>
                            </div>
                            <UiEventOrderStatusBadge :data="order.status" />
                            <div class="font-semibold">{{ order.amount }}<span class="font-light ml-2">USD</span></div>
                        </div>
                        <div v-if="showOrderBreakout" class="border-t mt-5 p-5">
                            <ul class="grow divide-y">
                                <li v-if="order.packageId" class="py-4 first:mt-0 last:mb-0">
                                    <div class="font-medium bg-slate-100 dark:bg-slate-800 py-1 flex items-center px-2 rounded-full">
                                        <StarIcon class="mr-2 size-4 opacity-75" />
                                        <span>Package</span>
                                    </div>
                                    <ul class="divide-y divide-dashed mx-4 mt-1">
                                        <li class="flex items-center justify-between gap-5 py-1.5 first:mt-0 last:mb-0">
                                            <div>{{ order.package.name }}</div>
                                            <div>
                                                <span class="font-semibold mr-1.5">{{ order.packagePrice }}</span>
                                                <span class="mr-1.5 font-light">USD</span>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                                <li v-if="order.sponsorshipItems.length > 0" class="py-4 first:mt-0 last:mb-0">
                                    <div class="font-medium bg-slate-100 dark:bg-slate-800 py-1 flex items-center px-2 rounded-full">
                                        <AwardIcon class="mr-2 size-4 opacity-75" />
                                        <span>Sponsorship Items & VIP Tables</span>
                                    </div>
                                    <ul class="divide-y divide-dashed mx-4 mt-1">
                                        <li v-for="(item, itemIndex) in order.sponsorshipItems" :key="itemIndex" class="flex items-center justify-between gap-5 py-1.5 first:mt-0 last:mb-0">
                                            <div>{{ item.name }}</div>
                                            <div>
                                                <span class="font-semibold mr-1.5">{{ item.priceUsed }}</span>
                                                <span class="mr-1.5 font-light">USD</span>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                                <li v-if="order.delegates.length > 0 || order.spouses.length > 0" class="py-4 first:mt-0 last:mb-0">
                                    <div class="font-medium bg-slate-100 dark:bg-slate-800 py-1 flex items-center px-2 rounded-full">
                                        <UsersIcon class="mr-2 size-4 opacity-75" />
                                        <span>Delegates & Spouses/Guests</span>
                                    </div>
                                    <ul class="divide-y divide-dashed mx-4 mt-1">
                                        <template v-if="order.delegates.length > 0">
                                            <li v-for="(delegate, delegateIndex) in order.delegates" :key="delegateIndex" class="flex items-center justify-between gap-5 py-1.5 first:mt-0 last:mb-0">
                                                <div>
                                                    <span>{{ delegate.name }}</span>
                                                    <span class="text-xs ml-2 text-slate-400">Delegate</span>
                                                </div>
                                                <div>
                                                    <span class="font-semibold mr-1.5">{{
                                                        order.packageId && order.package && delegateIndex < order.package.delegateCount ? 'Package Included' : order.totalDelegatesPrice / order.delegates.length
                                                    }}</span>
                                                    <span v-if="order.packageId && order.package && delegateIndex >= order.package.delegateCount" class="mr-1.5 font-light"> USD </span>
                                                </div>
                                            </li>
                                        </template>

                                        <template v-if="order.spouses.length > 0">
                                            <li v-for="(spouse, spouseIndex) in order.spouses" :key="spouseIndex" class="flex items-center justify-between gap-5 py-1.5 first:mt-0 last:mb-0">
                                                <div>
                                                    <span>{{ spouse.name }}</span>
                                                    <span class="text-xs ml-2 text-slate-400">Spouse</span>
                                                </div>
                                                <div>
                                                    <span class="font-semibold mr-1.5">{{ order.totalSpousesPrice / order.spouses.length }}</span>
                                                    <span class="mr-1.5 font-light">USD</span>
                                                </div>
                                            </li>
                                        </template>
                                    </ul>
                                </li>
                                <li v-if="order.rooms.length > 0" class="py-4 first:mt-0 last:mb-0">
                                    <div class="font-medium bg-slate-100 dark:bg-slate-800 py-1 flex items-center px-2 rounded-full">
                                        <UmbrellaIcon class="mr-2 size-4 opacity-75" />
                                        <span>Accommodation</span>
                                    </div>
                                    <ul class="divide-y divide-dashed mx-4 mt-1">
                                        <li v-for="(room, roomIndex) in order.rooms" :key="roomIndex" class="flex items-start justify-between gap-5 py-1.5 first:mt-0 last:mb-0">
                                            <div>
                                                <div class="flex items-center gap-2">
                                                    <div>{{ room.room.name }}</div>
                                                    <div class="capitalize">
                                                        <span class="px-2 py-0.5 font-medium rounded-md bg-slate-200 text-xs">{{ room.room.type }}</span>
                                                    </div>
                                                </div>
                                                <div class="items-center flex space-x-2 mt-1">
                                                    <div class="opacity-85 dark:opacity-65">{{ room.startDate }}</div>
                                                    <ArrowRightIcon class="size-4" />
                                                    <div class="opacity-85 dark:opacity-65">{{ room.endDate }}</div>
                                                </div>
                                                <div class="opacity-85 dark:opacity-65 mt-1 text-sm font-medium">
                                                    {{ getDaysAndNightsValues(room.date) }}
                                                </div>
                                            </div>
                                            <div>
                                                <span class="font-semibold mr-1.5">{{ room.totalPrice }}</span>
                                                <span class="mr-1.5 font-light">USD</span>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <div class="border-t py-3 px-4 space-y-2">
                                <div class="flex items-center justify-between gap-5">
                                    <div>Sub Total</div>
                                    <div class="font-medium">
                                        <span class="mr-1.5">{{ order.total }}</span>
                                        <span class="text-sm font-light">USD</span>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between gap-5">
                                    <div>Discount</div>
                                    <div class="font-medium">
                                        <span class="mr-1.5">{{ (order.total - order.amount).toFixed(0) }}</span>
                                        <span class="text-sm font-light">USD</span>
                                    </div>
                                </div>
                                <div class="text-xl font-semibold flex items-center justify-between gap-5">
                                    <div>Total</div>
                                    <div>
                                        <span class="mr-1.5">{{ order.amount }}</span>
                                        <span class="text-sm font-light">USD</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
