<script lang="ts" setup>
const settingStore = useSettingsStore();
defineProps({
    open: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['toggleSidebar']);
const menuItems = ref<SideBarMenu[]>([
    'Overview',
    { name: 'Network Overview', path: '/', icon: 'solar:monitor-linear', subMenus: [], permission: [] },
    {
        name: 'Network Reports',
        path: '/network-reports',
        icon: 'solar:chart-linear',
        permission: ['network_report_vote_list', 'network_report_log_list', 'network_report_visit_list', 'network_report_countries_capacity'],
        subMenus: [
            { name: 'Votes', path: '/network-reports/votes', icon: 'solar:chart-square-linear', subMenus: [], permission: ['network_report_vote_list'] },
            { name: 'Logs', path: '/network-reports/logs', icon: 'solar:checklist-line-duotone', subMenus: [], permission: ['network_report_log_list'] },
            { name: 'Countries Capacity', path: '/network-reports/countries-capacity', icon: 'solar:planet-3-outline', subMenus: [], permission: ['network_report_countries_capacity'] },
            {
                name: 'Visits',
                path: '/network-reports/visits',
                icon: 'solar:square-transfer-vertical-linear',
                subMenus: [],
                permission: ['network_report_visit_list'],
            },
            { name: 'Expire Soon Members', path: '/network-reports/expire-soon-members', icon: 'solar:case-minimalistic-linear', subMenus: [], permission: ['network_report_vote_list'] },
        ],
    },
    {
        name: 'Master Data',
        path: '/master-data',
        icon: 'solar:server-outline',
        permission: ['continent_list', 'country_list', 'city_list', 'network_certificate_list', 'network_service_list', 'network_referral_list'],
        subMenus: [
            { name: 'Continents', path: '/master-data/continents', icon: 'solar:asteroid-linear', subMenus: [], permission: ['continent_list'] },
            { name: 'Countries', path: '/master-data/countries', icon: 'solar:asteroid-linear', subMenus: [], permission: ['country_list'] },
            { name: 'Cities', path: '/master-data/cities', icon: 'solar:map-linear', subMenus: [], permission: ['city_list'] },
            {
                name: 'Certificates',
                path: '/master-data/certificates',
                icon: 'solar:medal-ribbons-star-linear',
                subMenus: [],
                permission: ['network_certificate_list'],
            },
            {
                name: 'Services',
                path: '/master-data/services',
                icon: 'solar:server-square-update-linear',
                subMenus: [],
                permission: ['network_service_list'],
            },
            {
                name: 'Referrals',
                path: '/master-data/referrals',
                icon: 'solar:multiple-forward-left-linear',
                subMenus: [],
                permission: ['network_referral_list'],
            },
        ],
    },
    'Network Options',
    {
        name: 'Website Data',
        path: '/website-data',
        icon: 'solar:file-text-line-duotone',
        permission: [
            'network_page_list',
            'network_section_list',
            'network_menu_list',
            'network_article_list',
            'network_event_list',
            'network_slider_list',
            'network_testimonial_list',
            'network_partner_list',
            'network_team_list',
            'network_incoterm_list',
            'network_faq_list',
            'network_benefit_list',
            'network_message_list',
        ],
        subMenus: [
            {
                name: 'Pages',
                path: '/website-data/pages',
                icon: 'solar:pen-new-square-linear',
                subMenus: [],
                permission: ['network_page_list'],
            },
            {
                name: 'Sections',
                path: '/website-data/sections',
                icon: 'solar:server-outline',
                subMenus: [],
                permission: ['network_section_list'],
            },
            {
                name: 'Menus',
                path: '/website-data/menus',
                icon: 'solar:hamburger-menu-outline',
                subMenus: [],
                permission: ['network_menu_list'],
            },
            {
                name: 'News',
                path: '/website-data/news',
                icon: 'solar:document-text-linear',
                subMenus: [],
                permission: ['network_article_list'],
            },
            {
                name: 'Events',
                path: '/website-data/events',
                icon: 'solar:calendar-mark-line-duotone',
                subMenus: [],
                permission: ['network_event_list'],
            },
            {
                name: 'Sliders',
                path: '/website-data/sliders',
                icon: 'solar:gallery-bold-duotone',
                subMenus: [],
                permission: ['network_slider_list'],
            },
            {
                name: 'Testimonials',
                path: '/website-data/testimonials',
                icon: 'solar:chat-round-line-line-duotone',
                subMenus: [],
                permission: ['network_testimonial_list'],
            },
            {
                name: 'Partners',
                path: '/website-data/partners',
                icon: 'solar:users-group-two-rounded-outline',
                subMenus: [],
                permission: ['network_partner_list'],
            },
            {
                name: 'Team Members',
                path: '/website-data/team',
                icon: 'solar:users-group-rounded-linear',
                subMenus: [],
                permission: ['network_team_list'],
            },
            {
                name: 'Incoterms',
                path: '/website-data/incoterms',
                icon: 'solar:server-outline',
                subMenus: [],
                permission: ['network_incoterm_list'],
            },
            {
                name: 'FAQ',
                path: '/website-data/network-faq',
                icon: 'solar:question-square-linear',
                subMenus: [],
                permission: ['network_faq_list'],
            },
            {
                name: 'Benefits',
                path: '/website-data/benefits',
                icon: 'solar:stars-minimalistic-line-duotone',
                subMenus: [],
                permission: ['network_benefit_list'],
            },
            {
                name: 'Contact Messages',
                path: '/website-data/network-messages',
                icon: 'solar:chat-line-line-duotone',
                subMenus: [],
                permission: ['network_message_list'],
            },
        ],
    },
    'Members Area',
    {
        name: "Member's Data",
        path: '/members-data',
        icon: 'solar:clipboard-check-linear',
        permission: ['network_member_list', 'network_contact_person_list', 'network_trade_reference_list', 'network_group_list'],
        subMenus: [
            { name: 'Members', path: '/members-data/members', icon: 'solar:case-minimalistic-linear', subMenus: [], permission: ['network_member_list'] },
            {
                name: 'Contact Persons',
                path: '/members-data/contact-persons',
                icon: 'solar:users-group-two-rounded-line-duotone',
                subMenus: [],
                permission: ['network_contact_person_list'],
            },
            {
                name: 'Trade References',
                path: '/members-data/trade-references',
                icon: 'solar:bill-list-outline',
                subMenus: [],
                permission: ['network_trade_reference_list'],
            },
            { name: 'Groups', path: '/members-data/groups', icon: 'solar:link-square-line-duotone', subMenus: [], permission: ['network_group_list'] },
            { name: 'Claim Forms', path: '/members-data/claim-forms', icon: 'solar:square-transfer-horizontal-broken', subMenus: [], permission: ['network_claim_form_list'] },
        ],
    },
    {
        name: 'Pending Applications',
        path: '/members-data/pending-applications',
        icon: 'solar:clipboard-text-outline',
        subMenus: [],
        permission: ['network_application_list'],
    },
    'Event & Conferences',
    { name: 'Conference Overview', path: '/conferences/overview', icon: 'solar:monitor-linear', subMenus: [], permission: [] },
    {
        name: 'Conferences',
        path: '/conferences',
        icon: 'solar:calendar-mark-outline',
        permission: ['conference_list', 'conference_day_list', 'conference_time_slot_list', 'conference_program_list', 'conference_coupon_list', 'conference_sponsor_list'],
        subMenus: [
            { name: 'Conferences', path: '/conferences/conferences', icon: 'solar:calendar-outline', subMenus: [], permission: ['conference_list'] },
            { name: 'Event Days', path: '/conferences/event-days', icon: 'solar:sunrise-outline', subMenus: [], permission: ['conference_day_list'] },
            { name: 'Time Slots', path: '/conferences/time-slots', icon: 'solar:watch-square-linear', subMenus: [], permission: ['conference_time_slot_list'] },
            {
                name: 'Agenda Programs',
                path: '/conferences/agenda-programs',
                icon: 'solar:server-2-linear',
                subMenus: [],
                permission: ['conference_program_list'],
            },
            {
                name: 'Discount coupons',
                path: '/conferences/discount-coupons',
                icon: 'solar:tag-price-linear',
                subMenus: [],
                permission: ['conference_coupon_list'],
            },
            { name: 'Sponsors', path: '/conferences/sponsors', icon: 'solar:medal-ribbon-star-linear', subMenus: [], permission: ['conference_sponsor_list'] },
        ],
    },
    {
        name: 'Conferences Data',
        path: '/conferences-data',
        icon: 'solar:document-add-linear',
        permission: [
            'conference_menu_list',
            'conference_shirt_list',
            'conference_dietary_list',
            'conference_message_list',
            'conference_hotel_list',
            'conference_room_list',
            'conference_package_list',
            'conference_sponsorship_item_list',
            'conference_faq_list',
        ],
        subMenus: [
            {
                name: 'Header Menu',
                path: '/conferences-data/header-menu',
                icon: 'solar:hamburger-menu-line-duotone',
                subMenus: [],
                permission: ['conference_menu_list'],
            },
            {
                name: 'T-Shirt Sizes',
                path: '/conferences-data/t-shirt-sizes',
                icon: 'solar:t-shirt-outline',
                subMenus: [],
                permission: ['conference_shirt_list'],
            },
            {
                name: 'Dietaries',
                path: '/conferences-data/dietaries',
                icon: 'solar:donut-bitten-bold-duotone',
                subMenus: [],
                permission: ['conference_dietary_list'],
            },
            {
                name: 'Contact Messages',
                path: '/conferences-data/conference-contact-messages',
                icon: 'solar:chat-line-line-duotone',
                subMenus: [],
                permission: ['conference_message_list'],
            },
            // { name: 'Hotels', path: '/conferences-data/hotels', icon: 'solar:buildings-2-line-duotone', subMenus: [], permission: ['conference_hotel_list'] },
            { name: 'Rooms', path: '/conferences-data/rooms', icon: 'solar:bed-line-duotone', subMenus: [], permission: ['conference_room_list'] },
            { name: 'Packages', path: '/conferences-data/packages', icon: 'solar:box-outline', subMenus: [], permission: ['conference_package_list'] },
            {
                name: 'Sponsorship Items',
                path: '/conferences-data/sponsorship-items',
                icon: 'solar:medal-ribbons-star-linear',
                subMenus: [],
                permission: ['conference_sponsorship_item_list'],
            },
            {
                name: 'Help Center',
                path: '/conferences-data/help-center',
                icon: 'solar:question-square-linear',
                subMenus: [],
                permission: ['conference_faq_list'],
            },
        ],
    },
    {
        name: 'Conferences Pages',
        path: '/conferences-page',
        icon: 'solar:layers-outline',
        permission: ['conference_page_list'],
        subMenus: [
            {
                name: 'Home',
                path: '/conferences-page/home',
                icon: 'solar:home-smile-angle-linear',
                permission: ['conference_page_list'],
                subMenus: [],
            },
            {
                name: 'Agenda',
                path: '/conferences-page/agenda',
                icon: 'solar:calendar-outline',
                permission: ['conference_page_list'],
                subMenus: [],
            },
            {
                name: 'Pricing',
                path: '/conferences-page/pricing',
                icon: 'solar:dollar-minimalistic-outline',
                permission: ['conference_page_list'],
                subMenus: [],
            },
            {
                name: 'Visa',
                path: '/conferences-page/visa',
                icon: 'solar:passport-linear',
                permission: ['conference_page_list'],
                subMenus: [],
            },
            {
                name: 'Venue',
                path: '/conferences-page/venue',
                icon: 'solar:streets-map-point-linear',
                permission: ['conference_page_list'],
                subMenus: [],
            },
            {
                name: 'Hotel',
                path: '/conferences-page/hotel',
                icon: 'solar:buildings-2-linear',
                permission: ['conference_page_list'],
                subMenus: [],
            },
            {
                name: 'Contact',
                path: '/conferences-page/contact',
                icon: 'solar:chat-line-line-duotone',
                permission: ['conference_page_list'],
                subMenus: [],
            },
            {
                name: 'Terms & Conditions',
                path: '/conferences-page/terms-and-conditions',
                icon: 'solar:notification-unread-lines-linear',
                permission: ['conference_page_list'],
                subMenus: [],
            },
            {
                name: 'Privacy Policy',
                path: '/conferences-page/privacy-policy',
                icon: 'solar:notification-unread-lines-linear',
                permission: ['conference_page_list'],
                subMenus: [],
            },
            {
                name: 'Login Page',
                path: '/conferences-page/login',
                icon: 'solar:login-3-line-duotone',
                permission: ['conference_page_list'],
                subMenus: [],
            },
            {
                name: 'Register Page',
                path: '/conferences-page/register',
                icon: 'solar:logout-3-line-duotone',
                permission: ['conference_page_list'],
                subMenus: [],
            },
        ],
    },
    {
        name: 'Attendees',
        path: '/conferences-attendees',
        icon: 'solar:users-group-two-rounded-outline',
        permission: ['conference_member_list', 'conference_delegate_list', 'conference_spouse_list', 'conference_order_list'],
        subMenus: [
            {
                name: 'Registered Companies',
                path: '/conferences-attendees/registered-members',
                icon: 'solar:suitcase-linear',
                subMenus: [],
                permission: ['conference_member_list'],
            },
            {
                name: 'Delegates',
                path: '/conferences-attendees/delegates',
                icon: 'solar:users-group-two-rounded-outline',
                subMenus: [],
                permission: ['conference_delegate_list'],
            },
            {
                name: 'Spouses',
                path: '/conferences-attendees/spouses',
                icon: 'solar:users-group-rounded-line-duotone',
                subMenus: [],
                permission: ['conference_spouse_list'],
            },
            {
                name: 'Orders',
                path: '/conferences-attendees/orders',
                icon: 'solar:clipboard-list-linear',
                subMenus: [],
                permission: ['conference_order_list'],
            },
        ],
    },
    {
        name: 'Conference Reports',
        path: '/conferences-reports',
        icon: 'solar:chart-linear',
        permission: ['conference_report_one_to_one_list', 'conference_report_member_by_category', 'conference_report_room_list', 'conference_report_dietary_list', 'conference_report_shirt_list'],
        subMenus: [
            {
                name: 'Events Att. Report',
                path: '/conferences-reports/members-category-report',
                icon: 'solar:users-group-two-rounded-line-duotone',
                subMenus: [],
                permission: ['conference_report_member_by_category'],
            },
            {
                name: 'One to One Report',
                path: '/conferences-reports/one-to-one-report',
                icon: 'solar:alarm-linear',
                subMenus: [],
                permission: ['conference_report_one_to_one_list'],
            },
            {
                name: 'Rooms Report',
                path: '/conferences-reports/booked-rooms-report',
                icon: 'solar:bed-line-duotone',
                subMenus: [],
                permission: ['conference_report_room_list'],
            },
            {
                name: 'Dietaries Report',
                path: '/conferences-reports/dietaries-report',
                icon: 'solar:chef-hat-line-duotone',
                subMenus: [],
                permission: ['conference_report_dietary_list'],
            },
            {
                name: 'T-Shirt Size Report',
                path: '/conferences-reports/t-shirts-sizes-report',
                icon: 'solar:t-shirt-outline',
                subMenus: [],
                permission: ['conference_report_shirt_list'],
            },
        ],
    },
    {
        name: 'Conference Settings',
        path: '/conferences-settings',
        icon: 'solar:settings-outline',
        permission: ['conference_setting_list', 'conference_setting_field_list', 'conference_email_template_list'],
        subMenus: [
            {
                name: 'Update Settings',
                path: '/conferences-settings/update-settings',
                icon: 'solar:pen-new-square-outline',
                subMenus: [],
                permission: ['conference_setting_list'],
            },
            {
                name: 'Setting Fields',
                path: '/conferences-settings/setting-fields',
                icon: 'solar:server-2-outline',
                subMenus: [],
                permission: ['conference_setting_field_list'],
            },
            {
                name: 'Email Templates',
                path: '/conferences-settings/email-templates',
                icon: 'solar:streets-navigation-linear',
                subMenus: [],
                permission: ['conference_email_template_list'],
            },
        ],
    },
    'Settings',
    {
        name: 'Admins Area',
        path: '/admins-area',
        icon: 'solar:server-2-line-duotone',
        permission: ['network_list', 'network_admin_list', 'network_role_list', 'network_affiliate_list'],
        subMenus: [
            {
                name: 'Networks',
                path: '/admins-area/networks',
                icon: 'solar:globus-outline',
                subMenus: [],
                permission: ['network_list'],
            },
            {
                name: 'Admins',
                path: '/admins-area/admins',
                icon: 'solar:shield-user-linear',
                subMenus: [],
                permission: ['network_admin_list'],
            },
            {
                name: 'Roles',
                path: '/admins-area/roles',
                icon: 'solar:eye-scan-bold',
                subMenus: [],
                permission: ['network_role_list'],
            },
            {
                name: 'Affiliates',
                path: '/admins-area/affiliates',
                icon: 'solar:chat-round-call-line-duotone',
                subMenus: [],
                permission: ['network_affiliate_list'],
            },
        ],
    },
    {
        name: 'Network Settings',
        path: '/network-settings',
        icon: 'solar:settings-outline',
        permission: ['network_setting_list', 'network_setting_field_list', 'network_email_template_list'],
        subMenus: [
            {
                name: 'Update Settings',
                path: '/network-settings/update-settings',
                icon: 'solar:pen-new-square-outline',
                subMenus: [],
                permission: ['network_setting_list'],
            },
            {
                name: 'Setting Fields',
                path: '/network-settings/setting-fields',
                icon: 'solar:server-2-outline',
                subMenus: [],
                permission: ['network_setting_field_list'],
            },
            {
                name: 'Media',
                path: '/network-settings/media',
                icon: 'solar:folder-linear',
                subMenus: [],
                permission: ['media_list'],
            },
            {
                name: 'Email Templates',
                path: '/network-settings/email-templates',
                icon: 'solar:streets-navigation-linear',
                subMenus: [],
                permission: ['network_email_template_list'],
            },
        ],
    },
]);

const route = useRoute();

const activeMenuItem = ref(route.fullPath);

function toggleSubMenuOpen(path: string) {
    activeMenuItem.value = path;
}

const isString = (item: SideBarMenu): item is string => typeof item === 'string';
const isSidebarMenuItem = (item: SideBarMenu): item is SidebarMenuItem => typeof item === 'object' && 'name' in item;
</script>

<template>
    <div class="text-white/75 sm:p-5 p-3 flex flex-col gap-8 sm:h-screen min-h-screen duration-300 ease-in-out">
        <div :class="[open ? 'flex items-center justify-between gap-5 px-4' : 'px-4']">
            <div :class="['flex items-center gap-3 place-content-center']">
                <Icon v-if="open" class="size-7 shrink-0" name="solar:asteroid-linear" />
                <div v-if="open" class="text-lg">
                    <span class="text-white">{{ settingStore.network?.name }}</span>
                    <span class="text-[0.65rem] font-light align-super ml-2 opacity-75">v1.0.3</span>
                </div>
            </div>
            <Icon v-if="!open" class="size-5 shrink-0 mx-auto cursor-pointer" name="solar:round-alt-arrow-right-linear" @click="emit('toggleSidebar')" />
            <Icon v-if="open" class="size-5 shrink-0 cursor-pointer hover:text-white" name="solar:round-alt-arrow-left-linear" @click="emit('toggleSidebar')" />
        </div>
        <div class="relative px-3 scrollbar-w-2 scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar scrollbar-thumb-white/25 overflow-y-hidden hover:overflow-y-auto">
            <ul class="flex flex-col gap-2 font-light text-sm mb-12">
                <template v-for="(item, i) in menuItems" :key="i">
                    <template v-if="isString(item)">
                        <li v-if="open" class="text-xs first:mt-0 mt-5 opacity-75">{{ item }}</li>
                        <li v-else class="first:mt-0 mt-5 opacity-75 text-center">...</li>
                    </template>
                    <template v-else-if="isSidebarMenuItem(item)">
                        <li v-if="useCheckPermission(item.permission as string[])" class="relative">
                            <NuxtLink
                                v-if="item"
                                :class="[
                                    open ? 'px-6 rounded-full' : 'px-2 rounded-xl',
                                    route.fullPath === item.path ? 'bg-white text-slate-700' : 'hover:bg-white/10 hover:text-white',
                                    'relative group py-2 flex items-center justify-between gap-3 w-full cursor-pointer',
                                ]"
                                :to="item.subMenus?.length > 0 ? '' : item.path"
                                @click="toggleSubMenuOpen(item.path)"
                            >
                                <div class="items-center flex gap-2">
                                    <Icon :name="item.icon" class="size-5 opacity-75 shrink-0" />
                                    <div v-if="open">{{ item.name }}</div>
                                </div>
                                <Icon
                                    v-if="item.subMenus?.length > 0 && open"
                                    :class="[activeMenuItem === item.path || item.subMenus.some((m) => m.path === activeMenuItem) ? 'rotate-90' : '', 'shrink-0 size-4 ease-in-out duration-300 opacity-75']"
                                    name="solar:alt-arrow-down-line-duotone"
                                />
                                <div v-if="!open" class="amj__tooltip-content">
                                    <span class="amj__tooltip-text">{{ item.name }}</span>
                                </div>
                            </NuxtLink>
                            <TransitionExpand>
                                <template v-if="activeMenuItem === item.path || item.subMenus.some((m) => m.path === activeMenuItem)">
                                    <ul v-if="item.subMenus.length > 0" class="bg-white/10 rounded-xl p-0.5 flex flex-col gap-2 mt-2">
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
                                                        <Icon :name="subItem.icon" class="size-5 opacity-75 shrink-0" />
                                                        <div v-if="open">{{ subItem.name }}</div>
                                                    </div>
                                                    <Icon v-if="subItem.subMenus.length > 0 && open" class="size-4 shrink-0 opacity-75" name="solar:alt-arrow-down-line-duotone" />
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
