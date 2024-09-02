<script setup>
const route = useRoute();
definePageMeta({
    middleware: 'auth',
});
const settings = useSettingsStore();
const networkModalOpen = ref(false);
const updateModalOpen = ref(false);
function openNetworkModal() {
    networkModalOpen.value = true;
}
function closeNetworkModal() {
    networkModalOpen.value = false;
}
function openUpdateModal() {
    updateModalOpen.value = true;
}
function closeUpdateModal() {
    updateModalOpen.value = false;
}
const { data: company, refresh } = await useApiFetch(`/api/user/${route.params.id}`, {
    lazy: true,
    transform: (company) => company.data,
});

const sendWelcomeEmail = async () => {
    const { data, error } = await useApiFetch('/api/email-approved', {
        lazy: true,
        method: 'POST',
        body: {
            userId: company.value.id,
        },
    });
    if (data.value) {
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
};
const sendResetPasswordEmail = async () => {
    const { data, error } = await useApiFetch('/api/email-reset-password', {
        lazy: true,
        method: 'POST',
        body: {
            userId: company.value.id,
        },
    });
    if (data.value) {
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
};
</script>
<template>
    <div v-if="company" class="flex flex-col gap-5">
        <div v-if="usePermissionCheck(['network_member_list', 'network_application_list'])" class="flex flex-col gap-5">
            <!-- Page Title & Action Buttons -->
            <div class="lg:flex lg:items-center lg:justify-between lg:gap-5">
                <div class="flex items-center gap-2">
                    <Icon name="solar:buildings-outline" class="size-5 opacity-75" />
                    <div>Member Profile</div>
                </div>
                <div v-if="usePermissionCheck(['network_member_update', 'network_application_update'])" class="lg:flex lg:items-center lg:gap-5 lg:space-y-0 space-y-5">
                    <button class="btn btn-primary btn-rounded px-6 btn-sm gap-3 lg:w-fit w-full lg:mt-0 mt-5" type="button" @click="openUpdateModal">
                        <Icon name="solar:pen-new-round-outline" class="size-5 opacity-75" />
                        <span>Update Member</span>
                    </button>
                    <HeadlessMenu as="div" class="relative inline-block">
                        <HeadlessMenuButton>
                            <Icon class="size-6 opacity-75 hover:scale-105 transition-all" name="solar:hamburger-menu-outline" />
                        </HeadlessMenuButton>
                        <TransitionExpand>
                            <HeadlessMenuItems as="div" class="absolute text-sm right-0 mt-3 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-slate-600 z-50">
                                <ul class="p-1">
                                    <HeadlessMenuItem as="li" class="py-0.5" @click="openNetworkModal">
                                        <div class="flex items-center gap-3 px-2 py-1.5 cursor-pointer hover:bg-slate-100 rounded-full transition-all">
                                            <Icon name="solar:add-circle-linear" class="size-5 opacity-75" />
                                            <span>Add Network</span>
                                        </div>
                                    </HeadlessMenuItem>
                                    <HeadlessMenuItem as="li" class="py-0.5" @click="sendWelcomeEmail">
                                        <div class="flex items-center gap-3 px-2 py-1.5 cursor-pointer hover:bg-slate-100 rounded-full transition-all">
                                            <Icon name="solar:streets-navigation-linear" class="size-5 opacity-75" />
                                            <span>Send Welcome Email</span>
                                        </div>
                                    </HeadlessMenuItem>
                                    <HeadlessMenuItem as="li" class="py-0.5" @click="sendResetPasswordEmail">
                                        <div class="flex items-center gap-3 px-2 py-1.5 cursor-pointer hover:bg-slate-100 rounded-full transition-all">
                                            <Icon name="solar:password-minimalistic-input-broken" class="size-5 opacity-75" />
                                            <span>Reset Password</span>
                                        </div>
                                    </HeadlessMenuItem>
                                </ul>
                            </HeadlessMenuItems>
                        </TransitionExpand>
                    </HeadlessMenu>
                </div>
            </div>
        </div>
        <div class="grid lg:grid-cols-12 gap-5 text-sm font-light items-start">
            <div class="lg:col-span-8 grid lg:grid-cols-12 gap-5">
                <div class="bg-white shadow-sm p-5 rounded-xl lg:col-span-4 flex items-center place-content-center">
                    <NuxtImg class="w-full h-24 flex items-center my-auto object-contain hover:scale-105 ease-in-out duration-300" :src="company.imageUrl" :alt="company.name" :title="company.name" />
                </div>
                <div class="bg-white shadow-sm p-5 rounded-xl lg:col-span-8">
                    <div class="font-medium text-base opacity-75">
                        <div class="line-clamp-1">{{ company.name }}</div>
                        <div class="font-light text-sm mt-0.5 lowercase hover:text-warning cursor-pointer transition-all" @click="useClipboard(company.email.toLowerCase())">{{ company.email.toLowerCase() }}</div>
                    </div>
                    <div class="border-t mt-1.5 pt-1.5 border-dashed">
                        <div class="flex items-center line-clamp-1 whitespace-nowrap">
                            <NuxtImg :src="company.country.imageUrl" :alt="company.country.name" :title="company.country.name" class="w-6 h-4 mr-2 object-contain" />
                            <div v-if="company.country" class="font-medium opacity-75">{{ company.country.name }}</div>
                            <div v-if="company.state" class="opacity-75 truncate">, {{ company.state }}</div>
                            <div v-if="company.city" class="opacity-75 truncate">, {{ company.city }}</div>
                        </div>
                        <div class="mt-1.5 pt-1.5 border-t border-dashed opacity-75">
                            <span v-if="company.addressLine1">{{ company.addressLine1 }}</span>
                            <span v-if="company.addressLine2">, {{ company.addressLine2 }}</span>
                        </div>
                    </div>
                </div>
                <template v-if="company.currentNetworkStatus">
                    <UiMemberStatusBox class="lg:col-span-4" :data="company.currentNetworkStatus.status" />
                    <UiMemberIDBox v-if="company.currentNetworkStatus.status !== 'pending'" class="lg:col-span-4" :data="company.wsaId" />
                    <UiMemberJoinBox v-else class="lg:col-span-4" :data="company.currentNetworkStatus.createdAt" />
                    <UiMemberFPPBox class="lg:col-span-4" :data="company.currentNetworkStatus.fpp" />
                </template>
                <div v-else class="lg:col-span-12 p-5 text-base text-center bg-white border-2 border-dashed font-medium opacity-75">This member is not assigned to any network</div>
                <div class="lg:col-span-12">
                    <div class="intro-y block sm:flex items-center h-10">
                        <h2 class="font-normal text-base truncate mr-5 flex items-center">
                            <Icon name="solar:clipboard-list-line-duotone" class="size-5 mr-2 opacity-75" />
                            Member Details
                        </h2>
                    </div>
                    <div class="bg-white shadow-sm rounded-xl intro-y p-5">
                        <div>
                            <!-- Company Details -->
                            <div class="flex border-b border-dashed pb-5 mb-5 last:border-b-0 last:pb-0 last:mb-0">
                                <div>
                                    <div class="font-medium text-base flex items-center opacity-75">
                                        <Icon name="solar:document-text-linear" class="size-4 mr-2 opacity-75 shrink-0" />
                                        <span>About</span>
                                    </div>
                                    <div class="ml-6">
                                        <div class="mt-1 opacity-75">
                                            {{ company?.profile }}
                                        </div>
                                        <div class="mt-1 opacity-75">
                                            <span class="font-normal mr-2">Branches:</span>
                                            {{ company?.branches }}
                                        </div>
                                        <div class="mt-1 opacity-75">
                                            <span class="font-normal mr-2">Business Established Year:</span>
                                            {{ company?.businessEst }}
                                        </div>
                                        <div class="mt-1 opacity-75">
                                            <span class="font-normal mr-2">Approximate Number Of Employees:</span>
                                            {{ company?.employeesNum }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Contact Information -->
                            <div class="flex border-b border-dashed pb-5 mb-5 last:border-b-0 last:pb-0 last:mb-0">
                                <div>
                                    <div class="font-medium text-base flex items-center opacity-75">
                                        <Icon name="solar:phone-calling-outline" class="size-4 mr-2 opacity-75 shrink-0" />
                                        <span>Contact Information</span>
                                    </div>
                                    <div class="ml-6">
                                        <div class="mt-1 opacity-75">
                                            <span class="font-normal mr-2">Login Email:</span>
                                            <span class="hover:text-warning transition-all cursor-pointer" @click="useClipboard(company.email)">
                                                {{ company.email }}
                                            </span>
                                        </div>
                                        <div class="mt-1 opacity-75">
                                            <span class="font-normal mr-2">Phone Number:</span>
                                            +{{ company.phoneKey }} {{ company.phone }}
                                        </div>
                                        <div class="mt-1 opacity-75">
                                            <span class="font-normal mr-2">Fax Number:</span>
                                            +{{ company.faxKey }} {{ company.fax }}
                                        </div>
                                        <div class="mt-1 opacity-75">
                                            <span class="font-normal mr-2">Company Email:</span>
                                            <span class="hover:text-warning transition-all cursor-pointer" @click="useClipboard(company.companyEmail)">
                                                {{ company?.companyEmail }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Website -->
                            <div v-if="company?.website" class="flex border-b border-dashed pb-5 mb-5 last:border-b-0 last:pb-0 last:mb-0">
                                <div>
                                    <div class="font-medium text-base flex items-center opacity-75">
                                        <Icon name="solar:basketball-outline" class="size-4 mr-2 opacity-75 shrink-0" />
                                        <span>Website</span>
                                    </div>
                                    <div class="ml-6">
                                        <a class="mt-1 opacity-75 hover:text-slate-800" target="_blank" :href="useCheckUrl(company.website)" :title="'Open' + ' ' + company.name + ' ' + 'in new window'">
                                            {{ useCheckUrl(company.website) }}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <!-- Company Address -->
                            <div class="flex border-b border-dashed pb-5 mb-5 last:border-b-0 last:pb-0 last:mb-0">
                                <div>
                                    <div class="font-medium text-base flex items-center opacity-75">
                                        <Icon name="solar:streets-map-point-linear" class="size-4 mr-2 opacity-75 shrink-0" />
                                        <span>Location</span>
                                    </div>
                                    <div class="ml-6">
                                        <div class="mt-1 opacity-75">
                                            <span class="font-normal mr-2">Address:</span>
                                            <span v-if="company.addressLine1">{{ company.addressLine1 }}</span>
                                            <span v-if="company.addressLine2">{{ company.addressLine2 }}</span>
                                        </div>
                                        <div class="mt-1 opacity-75">
                                            <span class="font-normal mr-2">Postal Code:</span>
                                            <span v-if="company.postalCode">{{ company.postalCode }}</span>
                                            <span v-else class="text-warning text-xs">N/A</span>
                                        </div>
                                        <div class="mt-1 opacity-75">
                                            <span class="font-normal mr-2">City:</span>
                                            <span v-if="company.city">{{ company.city }}</span>
                                        </div>
                                        <div class="mt-1 opacity-75">
                                            <span class="font-normal mr-2">City:</span>
                                            <span v-if="company.state">{{ company.state }}</span>
                                            <span v-else class="text-warning text-xs"> N/A </span>
                                        </div>
                                        <div class="mt-1 opacity-75 flex items-center">
                                            <span class="font-normal mr-2">Country:</span>
                                            <span v-if="company?.country" class="flex items-center">
                                                <NuxtImg class="w-5 h-3 object-cover mr-1" :src="company.country.imageUrl" :alt="company.country.name" :title="company.country.name" />
                                                {{ company.country.name }}
                                            </span>
                                            <span v-else class="text-warning text-xs">N/A</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Geolocation -->
                            <div class="flex border-b border-dashed pb-5 mb-5 last:border-b-0 last:pb-0 last:mb-0">
                                <div>
                                    <div class="font-medium text-base flex items-center opacity-75">
                                        <Icon name="solar:earth-linear" class="size-4 mr-2 opacity-75 shrink-0" />
                                        <span>Geolocation</span>
                                    </div>
                                    <div class="ml-6">
                                        <div class="mt-1 opacity-75">
                                            <span class="font-normal mr-2">Longitude:</span>
                                            <span v-if="company.mapLong">{{ company.mapLong }}</span>
                                            <span v-else class="text-warning text-xs">N/A</span>
                                        </div>
                                        <div class="mt-1 opacity-75">
                                            <span class="font-normal mr-2">Latitude:</span>
                                            <span v-if="company.mapLat">{{ company.mapLat }}</span>
                                            <span v-else class="text-warning text-xs">N/A</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-12">
                    <MemberServicesCard :services="company.services" :extra="company.otherServices" />
                </div>
                <div class="lg:col-span-12">
                    <MemberCertificatesCard :certificates="company.certificates" :extra="company.otherCertificates" />
                </div>
            </div>
            <div class="lg:col-span-4 flex flex-col gap-5">
                <!-- Networks Details -->
                <div class="flex flex-col gap-5">
                    <template v-if="company.networks && company.networks.length > 0">
                        <template v-for="network in company.networks" :key="network.id">
                            <template v-if="network.id === settings.networkId">
                                <MemberNetworkCard :network="network" :member-id="company.id" @refresh="refresh" />
                            </template>
                        </template>
                    </template>
                    <div v-else class="lg:col-span-12 p-5 text-base text-center bg-white border-2 border-dashed font-medium opacity-75">This member is not assigned to any network</div>
                </div>
                <MemberExtraInfoCard :member="company" />
                <MemberContactPersonCard :contact-persons="company.contactPersons" :member-id="company.id" @refresh="refresh" />
                <MemberTradeReferancesCard :trade-references="company.tradeReferences" />
            </div>
        </div>
        <MemberNetworkModal v-if="networkModalOpen" :open="networkModalOpen" :member-id="company.id" @close="closeNetworkModal" @refresh="refresh" />
        <MemberUpdateModal v-if="updateModalOpen" :open="updateModalOpen" :member="company" @close="closeUpdateModal" @refresh="refresh" />
    </div>
</template>
