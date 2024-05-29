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
    { name: 'Network Overview', path: '/', icon: 'solar:monitor-linear', subMenus: [], permission: [] },
    {
        name: 'Network Reports',
        path: '/network-reports',
        icon: 'solar:chart-linear',
        permission: ['list-vote', 'list-logs'],
        subMenus: [
            { name: 'Votes', path: '/network-reports/votes', icon: 'solar:chart-square-linear', subMenus: [], permission: ['list-vote'] },
            { name: 'Logs', path: '/network-reports/logs', icon: 'solar:checklist-line-duotone', subMenus: [], permission: ['list-log'] },
            {
                name: 'Visits',
                path: '/network-reports/visits',
                icon: 'solar:square-transfer-vertical-linear',
                subMenus: [],
                permission: ['list-visit'],
            },
        ],
    },
    {
        name: 'Master Data',
        path: '/master-data',
        icon: 'solar:server-outline',
        permission: ['list-continent', 'list-country', 'list-city', 'list-certificate', 'list-referral', 'list-service'],
        subMenus: [
            { name: 'Continents', path: '/master-data/continents', icon: 'solar:asteroid-linear', subMenus: [], permission: ['list-continent'] },
            { name: 'Countries', path: '/master-data/countries', icon: 'solar:asteroid-linear', subMenus: [], permission: ['list-country'] },
            { name: 'Cities', path: '/master-data/cities', icon: 'solar:map-linear', subMenus: [], permission: ['list-city'] },
            {
                name: 'Certificates',
                path: '/master-data/certificates',
                icon: 'solar:medal-ribbons-star-linear',
                subMenus: [],
                permission: ['list-certificate'],
            },
            {
                name: 'Services',
                path: '/master-data/services',
                icon: 'solar:server-square-update-linear',
                subMenus: [],
                permission: ['list-service'],
            },
            {
                name: 'Referrals',
                path: '/master-data/referrals',
                icon: 'solar:multiple-forward-left-linear',
                subMenus: [],
                permission: ['list-referral'],
            },
        ],
    },
    'Network Options',
    {
        name: 'Website Data',
        path: '/website-data',
        icon: 'solar:file-text-line-duotone',
        permission: ['list-page', 'list-section', 'list-menu', 'list-article', 'list-event', 'list-slider', 'list-testimonial', 'list-partner', 'list-team', 'list-incoterm', 'list-faq', 'list-benefit', 'list-message'],
        subMenus: [
            {
                name: 'Pages',
                path: '/website-data/pages',
                icon: 'solar:pen-new-square-linear',
                subMenus: [],
                permission: ['list-page'],
            },
            {
                name: 'Sections',
                path: '/website-data/sections',
                icon: 'solar:server-outline',
                subMenus: [],
                permission: ['list-section'],
            },
            {
                name: 'Menus',
                path: '/website-data/menus',
                icon: 'solar:hamburger-menu-outline',
                subMenus: [],
                permission: ['list-menu'],
            },
            {
                name: 'News',
                path: '/website-data/news',
                icon: 'solar:document-text-linear',
                subMenus: [],
                permission: ['list-article'],
            },
            {
                name: 'Events',
                path: '/website-data/events',
                icon: 'solar:calendar-mark-line-duotone',
                subMenus: [],
                permission: ['list-event'],
            },
            {
                name: 'Sliders',
                path: '/website-data/sliders',
                icon: 'solar:gallery-bold-duotone',
                subMenus: [],
                permission: ['list-slider'],
            },
            {
                name: 'Testimonials',
                path: '/website-data/testimonials',
                icon: 'solar:chat-round-line-line-duotone',
                subMenus: [],
                permission: ['list-testimonial'],
            },
            {
                name: 'Partners',
                path: '/website-data/partners',
                icon: 'solar:users-group-two-rounded-outline',
                subMenus: [],
                permission: ['list-partner'],
            },
            {
                name: 'Team Members',
                path: '/website-data/team',
                icon: 'solar:users-group-rounded-linear',
                subMenus: [],
                permission: ['list-team'],
            },
            {
                name: 'Incoterms',
                path: '/website-data/incoterms',
                icon: 'solar:server-outline',
                subMenus: [],
                permission: ['list-incoterm'],
            },
            {
                name: 'FAQ',
                path: '/website-data/network-faq',
                icon: 'solar:question-square-linear',
                subMenus: [],
                permission: ['list-faq'],
            },
            {
                name: 'Benefits',
                path: '/website-data/benefits',
                icon: 'solar:stars-minimalistic-line-duotone',
                subMenus: [],
                permission: ['list-benefit'],
            },
            {
                name: 'Contact Messages',
                path: '/website-data/network-messages',
                icon: 'solar:chat-line-line-duotone',
                subMenus: [],
                permission: ['list-message'],
            },
        ],
    },
    'Members Area',
    {
        name: "Member's Data",
        path: '/members-data',
        icon: 'solar:clipboard-check-linear',
        permission: ['list-member', 'list-contact-person', 'list-trade-reference', 'list-group'],
        subMenus: [
            { name: 'Members', path: '/members-data/members', icon: 'solar:case-minimalistic-linear', subMenus: [], permission: ['list-member'] },
            {
                name: 'Contact Persons',
                path: '/members-data/contact-persons',
                icon: 'solar:users-group-two-rounded-line-duotone',
                subMenus: [],
                permission: ['list-contact-person'],
            },
            {
                name: 'Trade References',
                path: '/members-data/trade-references',
                icon: 'solar:bill-list-outline',
                subMenus: [],
                permission: ['list-trade-reference'],
            },
            { name: 'Groups', path: '/members-data/groups', icon: 'solar:link-square-line-duotone', subMenus: [], permission: ['list-group'] },
        ],
    },
    {
        name: 'Pending Applications',
        path: '/members-data/pending-applications',
        icon: 'solar:clipboard-text-outline',
        subMenus: [],
        permission: ['list-pending-member'],
    },
    'Event & Conferences',
    { name: 'Conference Overview', path: '/conferences/overview', icon: 'solar:monitor-linear', subMenus: [], permission: [] },
    {
        name: 'Conferences',
        path: '/conferences',
        icon: 'solar:calendar-mark-outline',
        permission: ['list-conference', 'list-conference-day', 'list-conference-time-slot', 'list-conference-program', 'list-conference-coupon', 'list-conference-sponsor', 'list-conference-program'],
        subMenus: [
            { name: 'Conferences', path: '/conferences/conferences', icon: 'solar:calendar-outline', subMenus: [], permission: ['list-conference'] },
            { name: 'Event Days', path: '/conferences/event-days', icon: 'solar:sunrise-outline', subMenus: [], permission: ['list-conference-day'] },
            { name: 'Time Slots', path: '/conferences/time-slots', icon: 'solar:watch-square-linear', subMenus: [], permission: ['list-conference-time-slot'] },
            {
                name: 'Agenda Programs',
                path: '/conferences/agenda-programs',
                icon: 'solar:server-2-linear',
                subMenus: [],
                permission: ['list-conference-program'],
            },
            {
                name: 'Discount coupons',
                path: '/conferences/discount-coupons',
                icon: 'solar:tag-price-linear',
                subMenus: [],
                permission: ['list-conference-coupon'],
            },
            { name: 'Sponsors', path: '/conferences/sponsors', icon: 'solar:medal-ribbon-star-linear', subMenus: [], permission: ['list-conference-sponsor'] },
        ],
    },
    {
        name: 'Conferences Data',
        path: '/conferences-data',
        icon: 'solar:document-add-linear',
        permission: [
            'list-conference-menu',
            'list-conference-shirt-size',
            'list-conference-diet',
            'list-conference-message',
            'list-conference-hotel',
            'list-conference-room',
            'list-conference-package',
            'list-conference-sponsorship-item',
            'list-conference-faq',
        ],
        subMenus: [
            {
                name: 'Header Menu',
                path: '/conferences-data/header-menu',
                icon: 'solar:hamburger-menu-line-duotone',
                subMenus: [],
                permission: ['list-conference-menu'],
            },
            {
                name: 'T-Shirt Sizes',
                path: '/conferences-data/t-shirt-sizes',
                icon: 'solar:t-shirt-outline',
                subMenus: [],
                permission: ['list-conference-shirt-size'],
            },
            {
                name: 'Dietaries',
                path: '/conferences-data/dietaries',
                icon: 'solar:donut-bitten-bold-duotone',
                subMenus: [],
                permission: ['list-conference-diet'],
            },
            {
                name: 'Contact Messages',
                path: '/conferences-data/conference-contact-messages',
                icon: 'solar:chat-line-line-duotone',
                subMenus: [],
                permission: ['list-conference-message'],
            },
            { name: 'Hotels', path: '/conferences-data/hotels', icon: 'solar:buildings-2-line-duotone', subMenus: [], permission: ['list-conference-hotel'] },
            { name: 'Rooms', path: '/conferences-data/rooms', icon: 'solar:bed-line-duotone', subMenus: [], permission: ['list-conference-room'] },
            { name: 'Packages', path: '/conferences-data/packages', icon: 'solar:box-outline', subMenus: [], permission: ['list-conference-package'] },
            {
                name: 'Sponsorship Items',
                path: '/conferences-data/sponsorship-items',
                icon: 'solar:medal-ribbons-star-linear',
                subMenus: [],
                permission: ['list-conference-sponsorship-item'],
            },
            {
                name: 'Help Center',
                path: '/conferences-data/help-center',
                icon: 'solar:question-square-linear',
                subMenus: [],
                permission: ['list-conference-faq'],
            },
        ],
    },
    {
        name: 'Conferences Pages',
        path: '/conferences-page',
        icon: 'solar:layers-outline',
        permission: ['list-conference-page', 'edit-conference-page'],
        subMenus: [
            {
                name: 'Home',
                path: '/conferences-page/home',
                icon: 'solar:home-smile-angle-linear',
                permission: ['list-conference-page', 'edit-conference-page'],
                subMenus: [],
            },
            {
                name: 'Agenda',
                path: '/conferences-page/agenda',
                icon: 'solar:calendar-outline',
                permission: ['list-conference-page', 'edit-conference-page'],
                subMenus: [],
            },
            {
                name: 'Pricing',
                path: '/conferences-page/pricing',
                icon: 'solar:dollar-minimalistic-outline',
                permission: ['list-conference-page', 'edit-conference-page'],
                subMenus: [],
            },
            {
                name: 'Visa',
                path: '/conferences-page/visa',
                icon: 'solar:passport-linear',
                permission: ['list-conference-page', 'edit-conference-page'],
                subMenus: [],
            },
            {
                name: 'Venue',
                path: '/conferences-page/venue',
                icon: 'solar:streets-map-point-linear',
                permission: ['list-conference-page', 'edit-conference-page'],
                subMenus: [],
            },
            {
                name: 'Hotel',
                path: '/conferences-page/hotel',
                icon: 'solar:buildings-2-linear',
                permission: ['list-conference-page', 'edit-conference-page'],
                subMenus: [],
            },
            {
                name: 'Contact',
                path: '/conferences-page/contact',
                icon: 'solar:chat-line-line-duotone',
                permission: ['list-conference-page', 'edit-conference-page'],
                subMenus: [],
            },
            {
                name: 'Terms & Conditions',
                path: '/conferences-page/terms-and-conditions',
                icon: 'solar:notification-unread-lines-linear',
                permission: ['list-conference-page', 'edit-conference-page'],
                subMenus: [],
            },
            {
                name: 'Login Page',
                path: '/conferences-page/login',
                icon: 'solar:login-3-line-duotone',
                permission: ['list-conference-page', 'edit-conference-page'],
                subMenus: [],
            },
            {
                name: 'Register Page',
                path: '/conferences-page/register',
                icon: 'solar:logout-3-line-duotone',
                permission: ['list-conference-page', 'edit-conference-page'],
                subMenus: [],
            },
        ],
    },
    {
        name: 'Attendees',
        path: '/conferences-attendees',
        icon: 'solar:users-group-two-rounded-outline',
        permission: ['list-conference-member', 'list-conference-delegate', 'list-conference-spouse', 'list-conference-order'],
        subMenus: [
            {
                name: 'Registered members',
                path: '/conferences-attendees/registered-members',
                icon: 'solar:suitcase-linear',
                subMenus: [],
                permission: ['list-conference-member'],
            },
            {
                name: 'Delegates',
                path: '/conferences-attendees/delegates',
                icon: 'solar:users-group-two-rounded-outline',
                subMenus: [],
                permission: ['list-conference-delegate'],
            },
            {
                name: 'Spouses',
                path: '/conferences-attendees/spouses',
                icon: 'solar:users-group-rounded-line-duotone',
                subMenus: [],
                permission: ['list-conference-spouse'],
            },
            {
                name: 'Orders',
                path: '/conferences-attendees/orders',
                icon: 'solar:clipboard-list-linear',
                subMenus: [],
                permission: ['list-conference-order'],
            },
        ],
    },
    {
        name: 'Conference Reports',
        path: '/conferences-reports',
        icon: 'solar:chart-linear',
        permission: ['list-conference-report'],
        subMenus: [
            {
                name: 'One to One Report',
                path: '/conferences-reports/one-to-one-report',
                icon: 'solar:alarm-linear',
                subMenus: [],
                permission: ['list-conference-report'],
            },
            {
                name: 'Rooms Report',
                path: '/conferences-reports/booked-rooms-report',
                icon: 'solar:bed-line-duotone',
                subMenus: [],
                permission: ['list-conference-report'],
            },
            {
                name: 'Dietaries Report',
                path: '/conferences-reports/dietaries-report',
                icon: 'solar:chef-hat-line-duotone',
                subMenus: [],
                permission: ['list-conference-report'],
            },
            {
                name: 'T-Shirt Size Report',
                path: '/conferences-reports/t-shirts-sizes-report',
                icon: 'solar:t-shirt-outline',
                subMenus: [],
                permission: ['list-conference-report'],
            },
        ],
    },
    {
        name: 'Conference Settings',
        path: '/conferences-settings',
        icon: 'solar:settings-outline',
        permission: ['page-conference-setting', 'list-conference-setting', 'list-conference-email-template'],
        subMenus: [
            {
                name: 'Update Settings',
                path: '/conferences-settings/update-settings',
                icon: 'solar:pen-new-square-outline',
                subMenus: [],
                permission: ['page-conference-setting'],
            },
            {
                name: 'Setting Fields',
                path: '/conferences-settings/setting-fields',
                icon: 'solar:server-2-outline',
                subMenus: [],
                permission: ['list-conference-setting'],
            },
            {
                name: 'Email Templates',
                path: '/conferences-settings/email-templates',
                icon: 'solar:streets-navigation-linear',
                subMenus: [],
                permission: ['list-conference-email-template'],
            },
        ],
    },
    'Settings',
    {
        name: 'Admins Area',
        path: '/admins-area',
        icon: 'solar:server-2-line-duotone',
        permission: ['list-network', 'list-admin', 'list-role', 'list-affiliate'],
        subMenus: [
            {
                name: 'Networks',
                path: '/admins-area/networks',
                icon: 'solar:globus-outline',
                subMenus: [],
                permission: ['list-network'],
            },
            {
                name: 'Admins',
                path: '/admins-area/admins',
                icon: 'solar:shield-user-linear',
                subMenus: [],
                permission: ['list-admin'],
            },
            {
                name: 'Roles',
                path: '/admins-area/roles',
                icon: 'solar:eye-scan-bold',
                subMenus: [],
                permission: ['list-role'],
            },
            {
                name: 'Affiliates',
                path: '/admins-area/affiliates',
                icon: 'solar:chat-round-call-line-duotone',
                subMenus: [],
                permission: ['list-affiliate'],
            },
        ],
    },
    {
        name: 'Network Settings',
        path: '/network-settings',
        icon: 'solar:settings-outline',
        permission: ['page-setting', 'list-setting', 'list-email-template'],
        subMenus: [
            {
                name: 'Update Settings',
                path: '/network-settings/update-settings',
                icon: 'solar:pen-new-square-outline',
                subMenus: [],
                permission: ['page-setting'],
            },
            {
                name: 'Setting Fields',
                path: '/network-settings/setting-fields',
                icon: 'solar:server-2-outline',
                subMenus: [],
                permission: ['list-setting'],
            },
            {
                name: 'Email Templates',
                path: '/network-settings/email-templates',
                icon: 'solar:streets-navigation-linear',
                subMenus: [],
                permission: ['list-email-template'],
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
                    <template v-else>
                        <li v-if="useCheckPermission(item.permission as string[])" class="relative">
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
                                            <li v-if="useCheckPermission(subItem.permission as string[])" class="relative">
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
                </template>
            </ul>
        </div>
    </div>
</template>
