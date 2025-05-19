<script setup lang="ts">
const route = useRoute();
const userStore = useUserStore();
const settingStore = useSettingsStore();
const currentPath = route.fullPath;
const formattedPath = ref(formatRoutePath(route.fullPath));

function formatRoutePath(path: string) {
  if (path === '/') return [];
  path = path.replace(/^\//, '').replace(/\/$/, '');
  return path.split('/').map((segment, index, array) => {
    let name = segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    if (index === array.length - 1 && /^\d+$/.test(segment)) name = 'View';
    return { name, url: '/' + array.slice(0, index + 1).join('/') };
  });
}

watch(() => route.fullPath, (newPath) => {
  formattedPath.value = formatRoutePath(newPath);
});

async function logout() {
  await userStore.logout();
}

async function fetchNetworkData() {
  console.log('🔄 Fetching network data for ID:', settingStore.networkId);
  await settingStore.getNetwork();
  await settingStore.getCurrentConference();
  await settingStore.getAllConference();
  return navigateTo(currentPath, { replace: true });
}

watch(
  () => settingStore.networkId,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await fetchNetworkData();
            await reloadNuxtApp({ force: true });

    }
  }
);

const isLoading = ref(false);
async function resetServerCache() {
  isLoading.value = true;
  const { data, error } = await useApiFetch('/api/cache-clear', { lazy: true });
  useToast({
    title: error.value ? 'Error' : 'Success',
    message: (data.value?.message || 'Unknown response') as string,
    type: error.value ? 'error' : 'success',
    duration: 5000,
  });
  isLoading.value = false;
}
</script>

<template>
  <div class="flex items-center gap-5 justify-end lg:justify-between py-3 text-white/75 pl-5">
    <!-- Breadcrumb -->
    <ul class="lg:flex hidden items-center font-light gap-2 text-xs">
      <li class="flex items-center gap-2">
        <Icon class="size-4 opacity-50" name="solar:double-alt-arrow-right-line-duotone" />
        <NuxtLink :to="'/'" class="hover:opacity-100 opacity-50">Dashboard</NuxtLink>
        <Icon v-if="route.fullPath !== '/'" class="size-4 opacity-50" name="solar:double-alt-arrow-right-line-duotone" />
      </li>
      <template v-for="(path, i) in formattedPath" :key="i">
        <li class="flex items-center gap-2">
          <NuxtLink :to="i === formattedPath.length - 1 ? '' : path.url">
            <span :class="i === formattedPath.length - 1 ? 'text-white' : 'hover:opacity-100 opacity-50'">{{ path.name }}</span>
          </NuxtLink>
          <Icon v-if="i !== formattedPath.length - 1" class="size-4 opacity-50" name="solar:double-alt-arrow-right-line-duotone" />
        </li>
      </template>
    </ul>

    <!-- Actions -->
    <div class="flex items-center gap-5 z-50 mr-5">
      <button @click="resetServerCache" class="text-sm px-6 rounded-full bg-white border text-slate-600 py-2">Reset Server Cache</button>

      <FormSelectField
        id="network-selector"
        v-model="settingStore.networkId"
        class="text-slate-800 sm:w-auto w-36"
        placeholder="Select Network"
        :clearable="false"
        :select-data="settingStore.networks"
        labelvalue="name"
        keyvalue="id"
      />

      <HeadlessMenu as="div" class="relative inline-block">
        <HeadlessMenuButton>
          <div class="flex items-center gap-1.5 py-1 px-1 rounded-xl hover:bg-white/10">
            <div class="text-right">
              <div class="text-sm font-medium truncate">{{ userStore.user?.name }}</div>
              <div class="text-xs opacity-75 font-light truncate">
                {{ userStore.user?.superAdmin ? 'Super Admin' : userStore.user?.role?.name }}
              </div>
            </div>
            <Icon class="size-4 shrink-0" name="solar:alt-arrow-down-outline" />
          </div>
        </HeadlessMenuButton>
        <TransitionExpand>
          <HeadlessMenuItems class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black/5 text-slate-600">
            <ul class="py-1">
              <HeadlessMenuItem as="li">
                <NuxtLink class="w-full px-3 py-2 flex items-center gap-3 hover:bg-primary hover:text-white rounded-full" to="/profile">
                  <Icon class="size-5" name="solar:user-circle-line-duotone" /> Profile
                </NuxtLink>
              </HeadlessMenuItem>
              <HeadlessMenuItem as="li">
                <NuxtLink class="w-full px-3 py-2 flex items-center gap-3 hover:bg-primary hover:text-white rounded-full" to="/profile/edit">
                  <Icon class="size-5" name="solar:settings-outline" /> Edit Profile
                </NuxtLink>
              </HeadlessMenuItem>
              <HeadlessMenuItem as="li" class="text-danger">
                <div class="w-full px-3 py-2 flex items-center gap-3 cursor-pointer hover:bg-danger hover:text-white rounded-full" @click="logout">
                  <Icon class="size-5" name="solar:logout-3-line-duotone" /> Logout
                </div>
              </HeadlessMenuItem>
            </ul>
          </HeadlessMenuItems>
        </TransitionExpand>
      </HeadlessMenu>
    </div>
  </div>
</template>
