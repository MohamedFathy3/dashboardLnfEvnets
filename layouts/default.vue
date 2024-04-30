<script lang="ts" setup>
definePageMeta({
    middleware: 'auth'
})
</script>

<template>
    <div>
        Layout: default
        <slot/>
    </div>
</template>

<style scoped></style>
