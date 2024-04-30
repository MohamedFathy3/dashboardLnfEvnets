<script setup>
definePageMeta({
    layout: false,
    middleware: "guest"
})
const credentials = ref({
    email: null,
    password: null,
})
const userStore = useUserStore()
async function login() {
    await userStore.login()
}
</script>
<template>
    <div class="container">
        <div class="w-full min-h-screen p-5 md:p-20 flex items-center justify-center">
            <div class="w-96 intro-y">
                <WSANetworkLogo class="w-64 text-white mx-auto" alt="WSA Consol Dashboard"/>
                <form @submit.prevent="login">
                    <div
                        class="!rounded-3xl box px-5 py-8 mt-4 max-w-[450px] relative before:content-[''] before:z-[-1] before:w-[95%] before:h-full before:bg-slate-200/65 before:border before:border-slate-200/25 before:-mt-5 before:absolute before:rounded-2xl before:mx-auto before:inset-x-0 before:dark:bg-darkmode-600/70 before:dark:border-darkmode-500/60">
                        <div class="flex flex-col gap-5">
                            <FormInputField v-model="credentials.email"  placeholder="Email" type="email" name="email" rounded />
                            <FormInputField v-model="credentials.password"  placeholder="Password" type="password" name="password" rounded />
                        </div>
                        <div class="mt-5 xl:mt-8 text-center xl:text-left">
                            <button @click="login()" class="flex items-center btn btn-primary btn-rounded w-full mr-1 mb-2">
                                <Icon  class="size-5 mr-4" name="solar:login-3-line-duotone"/>
                                Login
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>