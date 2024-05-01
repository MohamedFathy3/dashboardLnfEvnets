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
                name: 'Referrals',
                path: '/master-data/referrals',
                icon: 'solar:multiple-forward-left-linear',
                subMenus: [],
            },
            {
                name: 'Services',
                path: '/master-data/services',
                icon: 'solar:server-square-update-linear',
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
                name: 'Pages',
                path: '/website-data/pages',
                icon: 'solar:pen-new-square-linear',
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
                <div v-if="open" class="text-lg">{{ settingStore.network?.name }}</div>
            </div>
            <Icon v-if="!open" class="size-5 mx-auto cursor-pointer" name="solar:round-alt-arrow-right-linear" @click="emit('toggleSidebar')" />
            <Icon v-if="open" class="size-5 cursor-pointer hover:text-white" name="solar:round-alt-arrow-left-linear" @click="emit('toggleSidebar')" />
        </div>
        <div class="pr-2 scrollbar-w-2 scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar scrollbar-thumb-white/25 overflow-y-hidden hover:overflow-y-auto overflow-x-hidden">
            <ul class="flex flex-col gap-2 font-light text-sm">
                <template v-for="(item, i) in menuItems" :key="i">
                    <template v-if="typeof item === 'string'">
                        <li v-if="open" class="text-xs first:mt-0 mt-5 opacity-75">{{ item }}</li>
                        <li v-else class="first:mt-0 mt-5 opacity-75 text-center">...</li>
                    </template>
                    <li v-else class="">
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
                                <Icon :name="item.icon" class="size-5" />
                                <div v-if="open">{{ item.name }}</div>
                            </div>
                            <Icon v-if="item.subMenus.length > 0 && open" class="size-4" name="solar:alt-arrow-down-line-duotone" />
                            <div v-if="!open" class="amj__tooltip-content">
                                <span>{{ item.name }}</span>
                            </div>
                        </NuxtLink>
                        <TransitionExpand>
                            <template v-if="activeMenuItem === item.path || item.subMenus.some((m) => m.path === activeMenuItem)">
                                <ul v-if="item.subMenus.length > 0" class="bg-white/10 rounded-xl p-2 flex flex-col gap-2 mt-2">
                                    <template v-for="(subItem, s) in item.subMenus" :key="s">
                                        <li class="">
                                            <NuxtLink
                                                :class="[
                                                    open ? 'px-4 rounded-full' : 'px-2 rounded-xl',
                                                    route.fullPath === subItem.path ? 'bg-white text-slate-700' : 'hover:bg-primary hover:text-white',
                                                    'relative group py-2 flex items-center justify-between gap-3 w-full',
                                                ]"
                                                :to="subItem.path"
                                            >
                                                <div class="items-center flex gap-2">
                                                    <Icon :name="subItem.icon" class="size-5" />
                                                    <div v-if="open">{{ subItem.name }}</div>
                                                </div>
                                                <Icon v-if="subItem.subMenus.length > 0 && open" class="size-4" name="solar:alt-arrow-down-line-duotone" />
                                                <div v-if="!open" class="amj__tooltip-content">
                                                    <span>{{ subItem.name }}</span>
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
