<script lang="ts" setup>
const settingStore = useSettingsStore();
defineProps({
    open: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['toggleSidebar']);
const menuItems = ref([
    'Overview',
    { name: 'Network Overview', path: '/', icon: 'solar:monitor-linear', subMenus: [] },
    {
        name: 'Network Reports',
        path: '/network-reports',
        icon: 'solar:chart-linear',
        subMenus: [
            { name: 'Votes', path: '/network-reports/votes', icon: 'solar:chart-square-linear', subMenus: [] },
            { name: 'Logs', path: '/network-reports/logs', icon: 'solar:checklist-line-duotone', subMenus: [] },
            {
                name: 'Visits',
                path: '/network-reports/visits',
                icon: 'solar:square-transfer-vertical-linear',
                subMenus: [],
            },
        ],
    },
    {
        name: 'Master Data',
        path: '/master-data',
        icon: 'solar:server-outline',
        subMenus: [
            { name: 'Continents', path: '/master-data/continents', icon: 'solar:asteroid-linear', subMenus: [] },
            { name: 'Countries', path: '/master-data/countries', icon: 'solar:asteroid-linear', subMenus: [] },
            { name: 'Cities', path: '/master-data/cities', icon: 'solar:map-linear', subMenus: [] },
            {
                name: 'Certificates',
                path: '/master-data/certificates',
                icon: 'solar:medal-ribbons-star-linear',
                subMenus: [],
            },
            {
                name: 'Services',
                path: '/master-data/services',
                icon: 'solar:server-square-update-linear',
                subMenus: [],
            },
            {
                name: 'Referrals',
                path: '/master-data/referrals',
                icon: 'solar:multiple-forward-left-linear',
                subMenus: [],
            },
        ],
    },
    'Network Options',
    {
        name: 'Website Data',
        path: '/website-data',
        icon: 'solar:file-text-line-duotone',
        subMenus: [
            {
                name: 'Pages',
                path: '/website-data/pages',
                icon: 'solar:pen-new-square-linear',
                subMenus: [],
            },
            {
                name: 'Sections',
                path: '/website-data/sections',
                icon: 'solar:server-outline',
                subMenus: [],
            },
            {
                name: 'Menus',
                path: '/website-data/menus',
                icon: 'solar:hamburger-menu-outline',
                subMenus: [],
            },
            {
                name: 'News',
                path: '/website-data/news',
                icon: 'solar:document-text-linear',
                subMenus: [],
            },
            {
                name: 'Events',
                path: '/website-data/events',
                icon: 'solar:calendar-mark-line-duotone',
                subMenus: [],
            },
            {
                name: 'Partners',
                path: '/website-data/partners',
                icon: 'solar:users-group-two-rounded-outline',
                subMenus: [],
            },
            {
                name: 'Team Members',
                path: '/website-data/team',
                icon: 'solar:users-group-rounded-linear',
                subMenus: [],
            },
            {
                name: 'Incoterms',
                path: '/website-data/incoterms',
                icon: 'solar:server-outline',
                subMenus: [],
            },
            {
                name: 'FAQ',
                path: '/website-data/network-faq',
                icon: 'solar:question-square-linear',
                subMenus: [],
            },
            {
                name: 'Benefits',
                path: '/website-data/benefits',
                icon: 'solar:stars-minimalistic-line-duotone',
                subMenus: [],
            },
            {
                name: 'Contact Messages',
                path: '/website-data/network-messages',
                icon: 'solar:chat-line-line-duotone',
                subMenus: [],
            },
        ],
    },
    'Members Area',
    {
        name: "Member's Data",
        path: '/members-data',
        icon: 'solar:clipboard-check-linear',
        subMenus: [
            { name: 'Members', path: '/members-data/members', icon: 'solar:case-minimalistic-linear', subMenus: [] },
            {
                name: 'Contact Persons',
                path: '/members-data/contact-persons',
                icon: 'solar:users-group-two-rounded-line-duotone',
                subMenus: [],
            },
            {
                name: 'Trade References',
                path: '/members-data/trade-references',
                icon: 'solar:bill-list-outline',
                subMenus: [],
            },
            { name: 'Groups', path: '/members-data/groups', icon: 'solar:link-square-line-duotone', subMenus: [] },
        ],
    },
    {
        name: 'Pending Applications',
        path: '/members-data/pending-applications',
        icon: 'solar:clipboard-text-outline',
        subMenus: [],
    },
    'Event & Conferences',
    { name: 'Conference Overview', path: '/conferences/overview', icon: 'solar:monitor-linear', subMenus: [] },
    {
        name: 'Conferences',
        path: '/conferences',
        icon: 'solar:calendar-mark-outline',
        subMenus: [
            { name: 'Conferences', path: '/conferences/conferences', icon: 'solar:calendar-outline', subMenus: [] },
            { name: 'Event Days', path: '/conferences/event-days', icon: 'solar:sunrise-outline', subMenus: [] },
            { name: 'Time Slots', path: '/conferences/time-slots', icon: 'solar:watch-square-linear', subMenus: [] },
            {
                name: 'Agenda Programs',
                path: '/conferences/agenda-programs',
                icon: 'solar:server-2-linear',
                subMenus: [],
            },
            {
                name: 'Discount coupons',
                path: '/conferences/discount-coupons',
                icon: 'solar:tag-price-linear',
                subMenus: [],
            },
            { name: 'Sponsors', path: '/conferences/sponsors', icon: 'solar:medal-ribbon-star-linear', subMenus: [] },
        ],
    },
    {
        name: 'Conferences Data',
        path: '/conferences-data',
        icon: 'solar:document-add-linear',
        subMenus: [
            {
                name: 'Header Menu',
                path: '/conferences-data/header-menu',
                icon: 'solar:hamburger-menu-line-duotone',
                subMenus: [],
            },
            {
                name: 'T-Shirt Sizes',
                path: '/conferences-data/t-shirt-sizes',
                icon: 'solar:t-shirt-outline',
                subMenus: [],
            },
            {
                name: 'Dietaries',
                path: '/conferences-data/dietaries',
                icon: 'solar:donut-bitten-bold-duotone',
                subMenus: [],
            },
            {
                name: 'Contact Messages',
                path: '/conferences-data/conference-contact-messages',
                icon: 'solar:chat-line-line-duotone',
                subMenus: [],
            },
            { name: 'Hotels', path: '/conferences-data/hotels', icon: 'solar:buildings-2-line-duotone', subMenus: [] },
            { name: 'Rooms', path: '/conferences-data/rooms', icon: 'solar:bed-line-duotone', subMenus: [] },
            { name: 'Packages', path: '/conferences-data/packages', icon: 'solar:box-outline', subMenus: [] },
            {
                name: 'Sponsorship Items',
                path: '/conferences-data/sponsorship-items',
                icon: 'solar:medal-ribbons-star-linear',
                subMenus: [],
            },
            {
                name: 'Help Center',
                path: '/conferences-data/help-center',
                icon: 'solar:question-square-linear',
                subMenus: [],
            },
        ],
    },
    {
        name: 'Conferences Pages',
        path: '/conferences-page',
        icon: 'solar:layers-outline',
        subMenus: [
            {
                name: 'Home',
                path: '/conferences-page/home',
                icon: 'solar:home-smile-angle-linear',
                subMenus: [],
            },
            {
                name: 'Agenda',
                path: '/conferences-page/agenda',
                icon: 'solar:calendar-outline',
                subMenus: [],
            },
            {
                name: 'Pricing',
                path: '/conferences-page/pricing',
                icon: 'solar:dollar-minimalistic-outline',
                subMenus: [],
            },
            {
                name: 'Visa',
                path: '/conferences-page/visa',
                icon: 'solar:passport-linear',
                subMenus: [],
            },
            {
                name: 'Venue',
                path: '/conferences-page/venue',
                icon: 'solar:streets-map-point-linear',
                subMenus: [],
            },
            {
                name: 'Hotel',
                path: '/conferences-page/hotel',
                icon: 'solar:buildings-2-linear',
                subMenus: [],
            },
            {
                name: 'Contact',
                path: '/conferences-page/contact',
                icon: 'solar:chat-line-line-duotone',
                subMenus: [],
            },
            {
                name: 'Terms & Conditions',
                path: '/conferences-page/terms-and-conditions',
                icon: 'solar:notification-unread-lines-linear',
                subMenus: [],
            },
            {
                name: 'Login Page',
                path: '/conferences-page/login',
                icon: 'solar:login-3-line-duotone',
                subMenus: [],
            },
            {
                name: 'Register Page',
                path: '/conferences-page/register',
                icon: 'solar:logout-3-line-duotone',
                subMenus: [],
            },
        ],
    },
    {
        name: 'Attendees',
        path: '/conferences-attendees',
        icon: 'solar:users-group-two-rounded-outline',
        subMenus: [
            {
                name: 'Registered members',
                path: '/conferences-attendees/registered-members',
                icon: 'solar:suitcase-linear',
                subMenus: [],
            },
            {
                name: 'Delegates',
                path: '/conferences-attendees/delegates',
                icon: 'solar:users-group-two-rounded-outline',
                subMenus: [],
            },
            {
                name: 'Spouses',
                path: '/conferences-attendees/spouses',
                icon: 'solar:users-group-rounded-line-duotone',
                subMenus: [],
            },
            {
                name: 'Orders',
                path: '/conferences-attendees/orders',
                icon: 'solar:clipboard-list-linear',
                subMenus: [],
            },
        ],
    },
    {
        name: 'Conference Reports',
        path: '/conferences-reports',
        icon: 'solar:chart-linear',
        subMenus: [
            {
                name: 'One to One Report',
                path: '/conferences-reports/one-to-one-report',
                icon: 'solar:alarm-linear',
                subMenus: [],
            },
            {
                name: 'Rooms Report',
                path: '/conferences-reports/booked-rooms-report',
                icon: 'solar:bed-line-duotone',
                subMenus: [],
            },
            {
                name: 'Dietaries Report',
                path: '/conferences-reports/dietaries-report',
                icon: 'solar:chef-hat-line-duotone',
                subMenus: [],
            },
            {
                name: 'T-Shirt Size Report',
                path: '/conferences-reports/t-shirts-sizes-report',
                icon: 'solar:t-shirt-outline',
                subMenus: [],
            },
        ],
    },
    {
        name: 'Conference Settings',
        path: '/conferences-settings',
        icon: 'solar:settings-outline',
        subMenus: [
            {
                name: 'Update Settings',
                path: '/conferences-settings/update-settings',
                icon: 'solar:pen-new-square-outline',
                subMenus: [],
            },
            {
                name: 'Setting Fields',
                path: '/conferences-settings/setting-fields',
                icon: 'solar:server-2-outline',
                subMenus: [],
            },
            {
                name: 'Email Templates',
                path: '/conferences-settings/email-templates',
                icon: 'solar:streets-navigation-linear',
                subMenus: [],
            },
        ],
    },
    'Settings',
    {
        name: 'Admins Area',
        path: '/admins-area',
        icon: 'solar:server-2-line-duotone',
        subMenus: [
            {
                name: 'Networks',
                path: '/admins-area/networks',
                icon: 'solar:globus-outline',
                subMenus: [],
            },
            {
                name: 'Admins',
                path: '/admins-area/admins',
                icon: 'solar:shield-user-linear',
                subMenus: [],
            },
            {
                name: 'Roles',
                path: '/admins-area/roles',
                icon: 'solar:eye-scan-bold',
                subMenus: [],
            },
            {
                name: 'Affiliates',
                path: '/admins-area/affiliates',
                icon: 'solar:chat-round-call-line-duotone',
                subMenus: [],
            },
        ],
    },
    {
        name: 'Network Settings',
        path: '/network-settings',
        icon: 'solar:settings-outline',
        subMenus: [
            {
                name: 'Update Settings',
                path: '/network-settings/update-settings',
                icon: 'solar:pen-new-square-outline',
                subMenus: [],
            },
            {
                name: 'Setting Fields',
                path: '/network-settings/setting-fields',
                icon: 'solar:server-2-outline',
                subMenus: [],
            },
            {
                name: 'Email Templates',
                path: '/network-settings/email-templates',
                icon: 'solar:streets-navigation-linear',
                subMenus: [],
            },
        ],
    },
]);

const route = useRoute();

const activeMenuItem = ref(route.fullPath);

function toggleSubMenuOpen(path: string) {
    activeMenuItem.value = path;
}
</script>

<template>
    <div class="text-white/75 p-5 flex flex-col gap-8">
        <div :class="[open ? 'flex items-center justify-between gap-5' : 'px-4']">
            <div :class="['flex items-center gap-3 place-content-center']">
                <Icon v-if="open" class="size-7" name="solar:asteroid-linear" />
                <div v-if="open" class="text-lg">
                    <span class="text-white">{{ settingStore.network?.name }}</span>
                    <span class="text-[0.65rem] font-light align-super ml-2 opacity-75">v1.0.3</span>
                </div>
            </div>
            <Icon v-if="!open" class="size-5 mx-auto cursor-pointer" name="solar:round-alt-arrow-right-linear" @click="emit('toggleSidebar')" />
            <Icon v-if="open" class="size-5 cursor-pointer hover:text-white" name="solar:round-alt-arrow-left-linear" @click="emit('toggleSidebar')" />
        </div>
        <div class="relative pr-2 scrollbar-w-2 scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar scrollbar-thumb-white/25 overflow-y-hidden hover:overflow-y-auto">
            <ul class="flex flex-col gap-2 font-light text-sm mb-12">
                <template v-for="(item, i) in menuItems" :key="i">
                    <template v-if="typeof item === 'string'">
                        <li v-if="open" class="text-xs first:mt-0 mt-5 opacity-75">{{ item }}</li>
                        <li v-else class="first:mt-0 mt-5 opacity-75 text-center">...</li>
                    </template>
                    <li v-else class="relative">
                        <NuxtLink
                            :class="[
                                open ? 'px-6 rounded-full' : 'px-4 rounded-xl',
                                route.fullPath === item.path ? 'bg-white text-slate-700' : 'hover:bg-white/10 hover:text-white',
                                'relative group py-2 flex items-center justify-between gap-3 w-full cursor-pointer',
                            ]"
                            :to="item.subMenus.length > 0 ? '' : item.path"
                            @click="toggleSubMenuOpen(item.path)"
                        >
                            <div class="items-center flex gap-2">
                                <Icon :name="item.icon" class="size-5 opacity-75" />
                                <div v-if="open">{{ item.name }}</div>
                            </div>
                            <Icon
                                v-if="item.subMenus.length > 0 && open"
                                :class="[activeMenuItem === item.path || item.subMenus.some((m) => m.path === activeMenuItem) ? 'rotate-90' : '', 'size-4 ease-in-out duration-300 opacity-75']"
                                name="solar:alt-arrow-down-line-duotone"
                            />
                            <div v-if="!open" class="amj__tooltip-content">
                                <span class="amj__tooltip-text">{{ item.name }}</span>
                            </div>
                        </NuxtLink>
                        <TransitionExpand>
                            <template v-if="activeMenuItem === item.path || item.subMenus.some((m) => m.path === activeMenuItem)">
                                <ul v-if="item.subMenus.length > 0" class="bg-white/10 rounded-xl p-2 flex flex-col gap-2 mt-2">
                                    <template v-for="(subItem, s) in item.subMenus" :key="s">
                                        <li class="relative">
                                            <NuxtLink
                                                :class="[
                                                    open ? 'px-4 rounded-full' : 'px-2 rounded-xl',
                                                    route.fullPath === subItem.path ? 'bg-white text-slate-700' : 'hover:bg-white/10 hover:text-white',
                                                    'relative group py-2 flex items-center justify-between gap-3 w-full',
                                                ]"
                                                :to="subItem.path"
                                            >
                                                <div class="items-center flex gap-2">
                                                    <Icon :name="subItem.icon" class="size-5 opacity-75" />
                                                    <div v-if="open">{{ subItem.name }}</div>
                                                </div>
                                                <Icon v-if="subItem.subMenus.length > 0 && open" class="size-4 opacity-75" name="solar:alt-arrow-down-line-duotone" />
                                                <div v-if="!open" class="amj__tooltip-content">
                                                    <span class="amj__tooltip-text">{{ subItem.name }}</span>
                                                </div>
                                            </NuxtLink>
                                        </li>
                                    </template>
                                </ul>
                            </template>
                        </TransitionExpand>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
