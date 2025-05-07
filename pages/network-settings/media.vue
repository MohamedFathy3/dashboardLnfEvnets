<script setup>
definePageMeta({ middleware: 'auth' });

const selectedRows = ref([]);
const sortByList = ref([
  { name: 'Sort By ID', value: 'id' },
  { name: 'Sort By Name', value: 'name' },
]);
const filter = ref({ name: null });
const serverParams = ref({
  page: 1,
  length: 10,
  search: null,
  paginate: true,
  notUsed: 1,
});

const {
  data: rows,
  status,
  refresh,
} = await useApiFetch('/api/media', {
  method: 'GET',
  params: serverParams.value,
  transform: (res) => res.data,
  lazy: true,
});

onMounted(async () => {
  await refresh();
});

watch(filter, (newVal) => {
  for (const key in newVal) {
    const value = newVal[key];
    if (value) {
      serverParams.value.filters = serverParams.value.filters || {};
      serverParams.value.filters[key] = value;
    } else if (serverParams.value.filters) {
      delete serverParams.value.filters[key];
    }
  }
}, { deep: true });

const toggleDeleted = async () => {
  serverParams.value.deleted = !serverParams.value.deleted;
  selectedRows.value = [];
  await refresh();
};

const isSelected = (id) => selectedRows.value.includes(id);
const allSelected = computed(() => (rows.value?.data ?? []).every((row) => isSelected(row.id)));

const selectAllRows = () => {
  const data = rows.value?.data ?? [];
  const all = data.every((row) => isSelected(row.id));
  selectedRows.value = all ? [] : data.map((row) => row.id);
};

const changePage = async (value) => {
  const pageNumber = parseInt(value);
  if (!isNaN(pageNumber)) {
    serverParams.value.page = pageNumber;
  }
  selectedRows.value = [];
  await refresh();
};

const toggleRowSelection = (id) => {
  const index = selectedRows.value.indexOf(id);
  index === -1 ? selectedRows.value.push(id) : selectedRows.value.splice(index, 1);
};

async function deleteItems() {
  const confirmed = confirm('Are you sure you want to delete selected items?');
  if (confirmed) {
    const { data, error } = await useApiFetch(`/api/media/delete`, {
      body: { items: selectedRows.value },
      method: 'DELETE',
      lazy: true,
    });
    if (data.value) {
      useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
      await refresh();
    } else if (error.value) {
      useToast({ title: 'Error', message: error.value.message, type: 'error', duration: 5000 });
    }
  }
}

async function forceDeleteItems() {
  const confirmed = confirm('Are you sure you want to delete selected items permanently?');
  if (confirmed) {
    const { data, error } = await useApiFetch(`/api/media/force-delete`, {
      body: { items: selectedRows.value },
      method: 'DELETE',
      lazy: true,
    });
    if (data.value) {
      useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
      await refresh();
    } else if (error.value) {
      useToast({ title: 'Error', message: error.value.message, type: 'error', duration: 5000 });
    }
  }
}
</script>

<template>
  <div v-if="usePermissionCheck(['conference_setting_field_list'])" class="flex flex-col gap-8">
    <div class="md:flex md:items-center md:justify-between md:gap-5">
      <div class="flex items-center gap-2">
        <Icon name="solar:server-2-outline" class="size-5 opacity-75" />
        <div>{{ serverParams.deleted ? 'Not Used Media' : 'Active Media' }}</div>
      </div>
      <div class="md:flex md:items-center md:gap-5 md:space-y-0 space-y-5">
        <button v-if="selectedRows.length > 0 && !serverParams.deleted" @click="deleteItems" class="btn btn-danger btn-sm">
          <Icon name="solar:trash-bin-minimalistic-line-duotone" class="size-4 mr-1" /> Delete Selected
        </button>
        <button v-if="selectedRows.length > 0 && serverParams.deleted" @click="forceDeleteItems" class="btn btn-danger btn-sm">
          <Icon name="solar:trash-bin-minimalistic-line-duotone" class="size-4 mr-1" /> Delete Permanently
        </button>
        <button @click="toggleDeleted" class="btn btn-primary btn-sm">
          <Icon name="solar:refresh-circle-outline" class="size-4 mr-1" /> {{ serverParams.deleted ? 'Show Used' : 'Show Not Used' }}
        </button>
      </div>
    </div>


    <form class="flex items-center gap-5 grow p-5 
     bg-slate-50 rounded-full mb-5">
      <div class="text-base grow relative">
        <FormInputField v-model="filter.name" placeholder="Search by Name" />
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon name="solar:magnifer-linear" class="h-5 w-5 text-slate-400" />
        </div>
      </div>
      <button type="button" class="btn-rounded btn-sm btn btn-primary px-4 gap-2" @click="refresh">
        <Icon name="solar:rounded-magnifer-line-duotone" class="size-5" />
        <span>Search</span>
      </button>
      <button type="button" class="btn-rounded btn-sm btn btn-secondary px-4 gap-2" @click="resetServerParams">
        <Icon name="solar:restart-circle-outline" class="size-5" />
        <span>Reset</span>
      </button>
    </form>


    <div class="grid lg:grid-cols-6 sm:grid-cols-6 gap-5">
      <div v-for="row in rows?.data" :key="row.id" @click="toggleRowSelection(row.id)"
           :class="['shadow-sm p-2 group rounded-xl border transition-all cursor-pointer', isSelected(row.id) ? 'ring-2 ring-primary' : '']">
        <img :src="row.fullUrl" :alt="row.name" :title="row.name"
             class="h-14 w-14 mx-auto rounded-xl object-cover transition-all bg-white group-hover:w-full group-hover:object-contain" />
        <div class="text-xs mt-3 text-center">
          <div class="truncate font-medium">{{ row.name }}</div>
          <div class="truncate font-light">{{ (row.size / 1024).toFixed(2) }} KB</div>
          <div class="truncate font-light">{{ row.mimeType }}</div>
        </div>
      </div>
    </div>

    <TableMediaPagination :pending="status === 'pending'" :rows="rows" :page="serverParams.page" @change-page="changePage" />
  </div>
</template>
