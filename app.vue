<script setup></script>

<template>
    <NuxtLayout>
        <div>
            <NuxtLoadingIndicator class="z-[9999]" color="rgb(30 132 199)" :height="4" :duration="5000" :throttle="0" />
            <NuxtPage />
        </div>
    </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(0.5rem);
}
</style>
