<script setup>
const route = useRoute();
definePageMeta({
    middleware: 'auth',
});
const showOrderBreakout = ref(false);

const { data: order, refresh } = await useApiFetch(`/api/dashboard/order/${route.params.id}`, {
    lazy: true,
    transform: (order) => order.data,
});
function showOrderDetails() {
    showOrderBreakout.value = !showOrderBreakout.value;
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
                <div class="flex items-start gap-2">
                    <Icon name="solar:buildings-outline" class="size-5 opacity-75" />
                    <div>
                        <div>{{ order.uuid }}</div>
                        <div class="text-xs opacity-75">{{ order.createdAt }}</div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <UiNetworkTypeBadge :data="order.company.membershipType" />
                    <ConferenceOrderStatusSwitch :order-id="order.id" :order-status="order.status" @reload="refresh" />
                </div>
            </div>
        </div>
        <div>
            <div class="grid lg:grid-cols-12 gap-8 text-sm font-light items-start">
                <div class="bg-white shadow-sm p-5 rounded-xl lg:col-span-3 flex items-center place-content-center h-full">
                    <NuxtImg class="w-full h-24 flex items-center my-auto object-contain hover:scale-105 ease-in-out duration-300" :src="order.company.imageUrl" :alt="order.company.name" :title="order.company.name" />
                </div>
                <div class="bg-white shadow-sm p-5 rounded-xl lg:col-span-6">
                    <div class="font-medium text-base opacity-75">
                        <div class="line-clamp-1">{{ order.company.name }}</div>
                        <div class="font-light text-sm mt-0.5 lowercase hover:text-warning cursor-pointer transition-all" @click="useClipboard(order.company.email.toLowerCase())">{{ order.company.email.toLowerCase() }}</div>
                    </div>
                    <ul class="border-t mt-1.5 pt-1.5 border-dashed">
                        <li class="flex items-center line-clamp-1 whitespace-nowrap">
                            <NuxtImg :src="order.company.countryFlag" :alt="order.company.countryName" :title="order.company.countryName" class="w-6 h-4 mr-2 object-contain" />
                            <div v-if="order.company.countryName" class="font-medium opacity-75">{{ order.company.countryName }}</div>
                            <div v-if="order.company.state" class="opacity-75 truncate">, {{ order.company.state }}</div>
                            <div v-if="order.company.city" class="opacity-75 truncate">, {{ order.company.city }}</div>
                        </li>
                        <li class="mt-1.5 pt-1.5 border-t border-dashed opacity-75">
                            <span v-if="order.company.addressLine1">{{ order.company.addressLine1 }}</span>
                            <span v-if="order.company.addressLine2">, {{ order.company.addressLine2 }}</span>
                        </li>
                    </ul>
                </div>
                <div class="bg-white shadow-sm p-5 rounded-xl lg:col-span-3 border-2 border-dashed h-full flex items-center place-content-center">
                    <div v-if="!order.packageId" class="text-center font-normal opacity-75">No Package for this order</div>
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
                <MemberOrderDelegateCard class="lg:col-span-12" :delegates="order.delegates" :grid="2" />
                <MemberOrderSpouseCard class="lg:col-span-12" :spouses="order.spouses" :grid="2" />
                <MemberOrderRoomsCard class="lg:col-span-12" :rooms="order.rooms" :grid="2" />
                <MemberOrderSponsorshipItemsCard class="lg:col-span-12" :items="order.sponsorshipItems" :grid="2" />
                <div class="lg:col-span-12">
                    <div class="flex items-center justify-between gap-5 mb-3">
                        <div class="font-medium text-base flex items-center gap-2 whitespace-nowrap">
                            <Icon name="solar:scissors-square-linear" class="size-5 opacity-75" />
                            <span>Coupon</span>
                        </div>
                    </div>
                    <div :class="[order.coupon ? 'border-success' : '', 'bg-white p-5 mt-5 rounded-xl border-2 border-dashed']">
                        <div v-if="!order.coupon" class="text-center italic">No Discount Coupon</div>
                        <div v-else class="flex items-center flex-wrap justify-between text-lg">
                            <div class="font-medium">{{ order.coupon.code }}</div>
                            <div>
                                <span>{{ order.coupon.discountType === 'percentage' ? '' : '-' }}</span>
                                <span class="px-0.5 font-medium">{{ order.coupon.discountValue }}</span>
                                <span>{{ order.coupon.discountType === 'percentage' ? '%' : '' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-8">
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
                                        <Icon name="solar:hand-stars-outline" class="mr-2 size-4 opacity-75" />
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
                                        <Icon name="solar:medal-ribbon-star-outline" class="mr-2 size-4 opacity-75" />
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
                                        <Icon name="solar:users-group-two-rounded-linear" class="mr-2 size-4 opacity-75" />
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
                                                    <span class="font-semibold mr-1.5">
                                                        {{ order.packageId && order.package && delegateIndex < order.package.delegateCount ? 'Package Included' : order.totalDelegatesPrice / order.delegates.length }}
                                                    </span>
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
                                        <Icon name="solar:bed-linear" class="mr-2 size-4 opacity-75" />
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
                                                    <Icon name="solar:double-alt-arrow-right-line-duotone" class="size-4" />
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
