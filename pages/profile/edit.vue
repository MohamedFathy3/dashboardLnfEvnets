<script lang="ts" setup>
import { email, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

definePageMeta({
    middleware: 'auth',
});
const formLoading = ref(false);
const {
    data: roles,
    status,
    refresh,
} = await useApiFetch('/api/role/index', {
    method: 'POST',
    body: {
        filters: {},
        orderBy: 'name',
        orderByDirection: 'asc',
        perPage: 25,
        page: 1,
        paginate: false,
        deleted: false,
    },
    transform: (roles) => (roles as ApiResponse).data as Role[],
    lazy: true,
});
const user = useUserStore();
const item = reactive<Admin>({
    id: user?.user?.id,
    name: user?.user?.name || '',
    roleId: user?.user?.roleId || undefined,
    email: user?.user?.email || '',
    password: undefined,
    superAdmin: user?.user?.superAdmin ?? false,
    role: undefined, // Include role if necessary
});

const rules = {
    name: { required },
    roleId: {},
    email: { required, email },
    password: {},
    superAdmin: {},
};

const v$ = useVuelidate(rules, item);

async function updateItem() {
    const { data, error } = await useApiFetch(`/api/admin/${item.id}`, {
        method: 'PATCH',
        body: item,
        lazy: true,
    });
    if (data.value) {
        useToast({ title: 'Success', message: data.value?.message as string, type: 'success', duration: 5000 });
        await user.fetchAuthUser();
    }
    if (error.value) {
        useToast({ title: 'Error', message: error.value.message, type: 'error', duration: 5000 });
    }
}
</script>
<template>
    <div>
        <div class="flex items-center gap-2 justify-between">
            <div class="flex items-center gap-2">
                <Icon name="solar:server-2-outline" class="size-5 opacity-75" />
                Update Profile
            </div>
            <button :disabled="formLoading" class="btn-rounded btn-sm btn btn-primary px-4" type="button" @click="updateItem()">
                <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:check-circle-broken'" class="w-5 h-5 mr-2" />
                <span>Update</span>
            </button>
        </div>
        <div class="grid lg:grid-cols-12 gap-5 items-start">
            <FormInputField v-model="item.name" :errors="v$.name.$errors" class="lg:col-span-12" label="Name" name="name" placeholder="Name" />
            <FormInputField v-model="item.email" :errors="v$.email.$errors" class="lg:col-span-6" label="Email" name="email" placeholder="Email" />
            <FormInputField v-model.trim="item.password" :errors="v$.password.$errors" class="lg:col-span-6" label="Password" name="password" placeholder="Password" />
            <FormSwitch :id="'super-admin'" v-model="item.superAdmin" :disabled="!user.user?.superAdmin" label="Super Admin" class="lg:col-span-6" />
            <template v-if="status !== 'pending'">
                <FormSelectField
                    v-model="item.roleId"
                    :disabled="!user.user?.superAdmin || item.superAdmin"
                    :select-data="roles as any"
                    labelvalue="name"
                    keyvalue="id"
                    :errors="v$.roleId.$errors"
                    class="lg:col-span-6"
                    label="Role"
                    name="role-id"
                    placeholder="Role"
                />
            </template>
        </div>
    </div>
</template>
