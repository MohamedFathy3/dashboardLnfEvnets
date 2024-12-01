<script lang="ts" setup>
definePageMeta({
    middleware: 'auth',
});

const user = useUserStore();
</script>
<template>
    <div v-if="user.user" class="flex flex-col gap-5">
        <div class="text-2xl">Hello, {{ user.user.name }}</div>
        <div class="grid lg:grid-cols-12 gap-5">
            <div class="lg:col-span-6 space-y-3">
                <div class="flex items-center gap-2">
                    <Icon name="solar:user-circle-outline" class="size-5 opacity-75" />
                    User Information
                </div>
                <ul class="box p-5 text-sm divide-y divide-dashed">
                    <li class="flex items-center justify-between gap-5 py-1.5">
                        <div class="font-light">Email</div>
                        <div>{{ user.user.email?.toLowerCase() }}</div>
                    </li>
                    <li class="flex items-center justify-between gap-5 py-1.5">
                        <div class="font-light">Role</div>
                        <div>{{ user.user.superAdmin ? 'Super Admin' : user.user.role ? user.user.role.name : 'No Assigned Role' }}</div>
                    </li>
                </ul>
            </div>
            <div class="lg:col-span-6 space-y-3">
                <div class="flex items-center gap-2 justify-between">
                    <div class="flex items-center gap-2">
                        <Icon name="solar:alarm-pause-line-duotone" class="size-5 opacity-75" />
                        Overdue Tasks
                    </div>
                    <NuxtLink class="text-xs px-2 py-1 rounded-full bg-white border md:w-auto w-full text-center" href="/profile/tasks">View More</NuxtLink>
                </div>
                <div class="font-light italic p-5 border-dashed border-2 text-sm text-slate-600 rounded-xl bg-white text-center">Hurray! you are all done, No Tasks found</div>
            </div>
            <div class="lg:col-span-12 space-y-3">
                <div class="flex items-center gap-2 justify-between">
                    <div class="flex items-center gap-2">
                        <Icon name="solar:server-2-outline" class="size-5 opacity-75" />
                        Assigned Tasks
                    </div>
                    <NuxtLink class="text-xs px-2 py-1 rounded-full bg-white border md:w-auto w-full text-center" href="/profile/tasks">View More</NuxtLink>
                </div>
                <div class="font-light italic p-5 border-dashed border-2 text-sm text-slate-600 rounded-xl bg-white text-center">Hurray! you are all done, No Tasks found</div>
            </div>
        </div>
    </div>
</template>
