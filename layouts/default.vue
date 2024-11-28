<template>
    <div class="flex items-start relative gap-5">
        <ToastList />
        <div :class="[sidebarOpen ? 'w-[290px] sm:shadow-none shadow-lg' : '', 'sm:fixed absolute delay-200 ease-in-out duration-500 whitespace-nowrap transform-all z-[999] sm:bg-transparent bg-primary']">
            <Sidebar :open="sidebarOpen" @toggle-sidebar="toggleSideBarOpenStatus" />
        </div>
        <div class="w-full">
            <LazyTopBar :class="[sidebarOpen ? 'sm:ml-[280px]' : 'ml-[90px] sm:ml-[90px]', 'relative ease-in-out duration-100 z-[99]']" />
            <div :class="[sidebarOpen ? 'sm:ml-[280px]' : 'ml-[90px] sm:ml-[90px]', 'bg-slate-100 mr-5 rounded-2xl p-5 z-10 ease-in-out duration-100 mb-12']">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup>
const sidebarOpen = ref(true);
const route = useRoute();

function toggleSideBarOpenStatus() {
    sidebarOpen.value = !sidebarOpen.value;
}

watch(
    () => route.fullPath,
    (newPath) => {
        if (window.innerWidth <= 768) {
            // Check if screen is medium (md) or less
            sidebarOpen.value = false; // Close sidebar on route change if screen is md or less
        }
    },
);
if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            // Check if screen is medium (md) or less
            sidebarOpen.value = false; // Close sidebar if screen is md or less
        }
    });
}

onMounted(() => {
    if (window.innerWidth <= 768) {
        sidebarOpen.value = false;
    }
});
</script>
