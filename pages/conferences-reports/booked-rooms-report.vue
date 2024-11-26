<script setup>
definePageMeta({
    middleware: 'auth',
});
const loadingPage = ref(true);

const config = useRuntimeConfig();
const bedTypes = ref([
    { value: 'king_size', name: 'King Size' },
    { value: 'twin', name: 'Twin Bed' },
]);
function calculateRoomTotalPrice(roomItem) {
    if (!roomItem) {
        return 'undefined';
    }
    let totalPrice = 0;
    roomItem.forEach((bookedRoom) => {
        totalPrice += bookedRoom.totalPrice;
    });
    return totalPrice;
}
function calculateRoomNights(roomItem) {
    if (!roomItem) {
        return 'undefined';
    }
    let nights = 0;
    roomItem.forEach((bookedRoom) => {
        nights += bookedRoom.nights;
    });
    return nights;
}

const selectedRoomIndex = ref(0);

function changeSelectedRoomIndex(index) {
    selectedRoomIndex.value = index;
}
const { data, execute, refresh } = await useApiFetch(`/api/event/room/report`, {
    lazy: true,
    immediate: false,
});

onMounted(async () => {
    loadingPage.value = true;
    await execute();
    loadingPage.value = false;
});
</script>
<template>
    <div v-if="usePermissionCheck(['conference_report_room_list'])">
        <div v-if="!loadingPage">
            <!-- Page Title & Action Buttons -->
            <div class="md:flex md:items-center md:justify-between md:gap-5">
                <div class="flex items-center gap-2">
                    <Icon name="solar:bed-line-duotone" class="size-5 opacity-75" />
                    <div>Booked Rooms Report</div>
                    <div class="bg-primary px-1.5 py-1 rounded-full aspect-1/1 text-white text-sm">{{ data.totalNightsUsed }}</div>
                    <div class="opacity-75 text-sm">Total Nights</div>
                </div>
                <div class="flex items-center gap-3">
                    <a v-if="usePermissionCheck(['conference_report_room_export'])" :href="config.public.apiUrl + '/export-excel/room-delegate/export'" target="_blank">
                        <button type="button" class="btn btn-dark btn-rounded btn-sm w-full justify-between gap-3">
                            <span class="items-center flex">
                                <Icon name="solar:bed-linear" class="w-5 h-5 mr-2" />
                                <span>Export Rooms</span>
                            </span>
                            <Icon name="solar:download-outline" class="w-5 h-5 mr-2" />
                        </button>
                    </a>
                    <ConferenceSwitcher @reload="refresh" />
                </div>
            </div>
            <ul v-if="data.rooms" class="mt-8 space-y-3 text-sm">
                <template v-for="(room, index) in data.rooms" :key="room.id">
                    <li v-if="room.bookedRooms.length > 0">
                        <div
                            :class="selectedRoomIndex === index ? 'bg-slate-800' : ''"
                            class="cursor-pointer hover:bg-slate-800 ease-in-out gap-5 duration-300 bg-primary text-white border grid lg:grid-cols-12 items-center py-2 px-4 text-base rounded-md justify-between"
                            @click="changeSelectedRoomIndex(index)"
                        >
                            <div class="lg:col-span-4 lg:text-left flex items-center gap-3 whitespace-nowrap">
                                <div class="text-sm">{{ room.name }}</div>
                                <div class="capitalize text-sm opacity-75 font-light mt-0.5">{{ room.type }}</div>
                            </div>
                            <div class="lg:col-span-4 font-medium mt-0.5 text-lg flex items-center gap-2">
                                <div class="font-light text-sm opacity-70">Total of</div>
                                <div>{{ calculateRoomNights(room.bookedRooms) }}</div>
                                <div class="font-light text-sm opacity-70">Nights</div>
                            </div>
                            <div class="lg:col-span-2 text-sm w-6 h-6 bg-white rounded-tl-full rounded-b-full flex place-content-center">
                                <div class="text-center mx-auto my-auto text-primary inline-flex font-medium">{{ room.bookedRooms.length }}</div>
                            </div>
                            <div class="lg:col-span-2 lg:text-right">
                                <div class="font-medium">{{ calculateRoomTotalPrice(room.bookedRooms) }} <span class="font-light text-xs opacity-70">USD</span></div>
                            </div>
                        </div>
                        <div v-show="selectedRoomIndex === index">
                            <div v-for="record in room.bookedRooms" :key="record.id" class="grid lg:grid-cols-12 items-center gap-5 p-3 bg-white shadow-sm rounded-lg my-2 border-success">
                                <div class="lg:col-span-4 text-xs whitespace-nowrap space-y-1 xl:border-r xl:pr-4 truncate">
                                    <div class="flex items-center">
                                        <div class="font-medium">{{ record.startFormatted }}</div>
                                        <Icon name="solar:double-alt-arrow-right-line-duotone" class="flex-shrink-0 w-4 h-4 mx-2 opacity-50" />
                                        <div>{{ record.endFormatted }}</div>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div><span class="font-light">Nights:</span> {{ record.nights }}</div>
                                        <div><span class="font-light">Days:</span> {{ record.days }}</div>
                                    </div>
                                    <div><span class="font-light">Bed Type:</span> {{ bedTypes.find((b) => b.value === record.bedType).name }}</div>
                                </div>
                                <template v-for="person in record.persons" :key="person.id">
                                    <div class="whitespace-nowrap lg:col-span-4">
                                        <div class="inline-flex text-left items-center">
                                            <div class="shrink-0">
                                                <NuxtImg :alt="person.name" :src="person.imageUrl" :title="person.name" class="!size-14 !rounded-full ring-2 -ring-offset-2 object-top ring-slate-500/10 object-cover bg-white" />
                                            </div>
                                            <div class="ml-2">
                                                <div class="font-medium truncate">{{ person.name }}</div>
                                                <div class="text-xs truncate capitalize">{{ person.jobTitle ? person.jobTitle : person.type }}</div>
                                                <div class="text-xs font-medium truncate">{{ person.company.name }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </li>
                </template>
            </ul>
            <!--            <div class="grid lg:grid-cols-12 gap-5 mt-8">-->
            <!--                <ul class="lg:col-span-4">-->
            <!--                    <li class="py-1.5 px-3 bg-white rounded-xl text-sm shadow-sm cursor-pointer">-->
            <!--                        <div class="flex items-center justify-between gap-5">-->
            <!--                            <div>Standard Guest Room</div>-->
            <!--                            <div>11</div>-->
            <!--                        </div>-->
            <!--                        <div class="flex items-center justify-between gap-5 mt-1">-->
            <!--                            <div>3190 <span class="font-light">USD</span></div>-->
            <!--                            <div class="font-light"><span class="font-medium">11</span> Nights</div>-->
            <!--                        </div>-->
            <!--                    </li>-->
            <!--                </ul>-->
            <!--                <div class="lg:cols-span-8"></div>-->
            <!--            </div>-->
        </div>
        <div v-else class="flex min-h-dvh items-center place-content-center text-center">
            <div>
                <div class="opacity-75 text-sm animate-pulse">Loading...</div>
                <Icon name="eos-icons:three-dots-loading" class="size-16" />
            </div>
        </div>
    </div>
</template>
