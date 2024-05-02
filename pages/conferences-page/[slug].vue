<script lang="ts" setup>
definePageMeta({
    middleware: 'auth',
});
const route = useRoute();
</script>
<template>
    <div>
        <span class="capitalize">{{ route.params.slug }}</span>
    </div>
</template>
