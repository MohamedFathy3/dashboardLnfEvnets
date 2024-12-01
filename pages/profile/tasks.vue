<script lang="ts" setup>
definePageMeta({
    middleware: 'auth',
});
</script>
<template>
    <div class="space-y-3">
        <div class="flex items-center gap-2 justify-between">
            <div class="flex items-center gap-2">
                <Icon name="solar:server-2-outline" class="size-5 opacity-75" />
                Tasks
            </div>
        </div>
        <div class="font-light italic p-5 border-dashed border-2 text-sm text-slate-600 rounded-xl bg-white text-center">Hurray! you are all done, No Tasks found</div>
    </div>
</template>
