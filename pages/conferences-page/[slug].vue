<script setup>
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

definePageMeta({
    middleware: 'auth',
});
const route = useRoute();
const slug = ref(route.params.slug);
const loadingPage = ref(true);
const formLoading = ref(false);
const isOpen = ref(false);
const editMode = ref(false);
const isOpenSubChild = ref(false);
const editModeSubChild = ref(false);
const { data, refresh, execute } = await useApiFetch(`/api/event-page-slug/${slug.value}`, {
    lazy: true,
    immediate: false,
});

const item = ref({
    id: null,
    title: null,
    name: null,
    slug: null,
    keywords: null,
    description: null,
    image: null,
    active: true,
    orderId: null,
});
const rules = ref({
    title: {},
    name: { required },
    slug: { required },
    keywords: {},
    description: {},
    image: {},
    active: {},
    orderId: {},
});
const v$ = useVuelidate(rules, item);

const children = ref({
    id: null,
    name: null,
    slug: null,
    postTitle: null,
    title: null,
    subTitle: null,
    description: null,
    default: true,
    shortDescription: null,
    buttonOneActive: false,
    buttonOne: {
        label: null,
        target: null,
        icon: null,
        style: null,
        url: null,
    },
    buttonTwoActive: false,
    buttonTwo: {
        label: null,
        target: null,
        icon: null,
        style: null,
        url: null,
    },
    divider: {
        active: true,
        style: 'default',
    },
    videoUrl: null,
    active: true,
    orderId: null,
    image: null,
    gallery: null,
});

const childrenRules = ref({
    name: { required },
    slug: { required },
    postTitle: {},
    title: {},
    subTitle: {},
    description: {},
    shortDescription: {},
    buttonOneActive: {},
    buttonOne: {},
    buttonTwoActive: {},
    buttonTwo: {},
    videoUrl: {},
    active: {},
    orderId: {},
    image: {},
    gallery: {},
});
const s$ = useVuelidate(childrenRules, children);

const subChild = ref({
    eventSectionPageId: isOpen && children.value?.id,
    title: null,
    icon: null,
    active: true,
    url: null,
    orderId: null,
    description: null,
    shortDescription: null,
    image: null,
});
const subChildRules = ref({
    title: {},
    icon: {},
    url: {},
    active: {},
    orderId: {},
    description: {},
    shortDescription: {},
    image: {},
});
const i$ = useVuelidate(subChildRules, subChild);

const buttonStyles = ref([
    { name: 'Primary', id: 'primary' },
    { name: 'Secondary', id: 'secondary' },
    { name: 'Success', id: 'success' },
    { name: 'Yellow', id: 'warning' },
    { name: 'Red', id: 'danger' },
    { name: 'Dark', id: 'dark' },
]);
const buttonTargets = ref([
    { name: 'Self (Same Tab)', id: '_self' },
    { name: 'New Tab', id: '_blank' },
]);
const dividerStyles = ref([
    { name: 'Default', id: 'default' },
    { name: 'Alternative', id: 'alternative' },
]);

const fetchChildren = async (id) => {
    const { data, error } = await useApiFetch(`/api/event-section-page/${id}`, {
        lazy: true,
    });
    if (data.value) {
        children.value = data.value.data;
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
};
const fetchSubChildren = async (id) => {
    const { data, error } = await useApiFetch(`/api/event-item/${id}`, {
        lazy: true,
    });
    if (data.value) {
        subChild.value = data.value.data;
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
};
const resetChildrenValues = async () => {
    children.value = {
        id: null,
        name: null,
        slug: null,
        postTitle: null,
        title: null,
        subTitle: null,
        description: null,
        default: true,
        shortDescription: null,
        buttonOneActive: false,
        buttonOne: {
            label: null,
            target: null,
            icon: null,
            style: null,
            url: null,
        },
        buttonTwoActive: false,
        buttonTwo: {
            label: null,
            target: null,
            icon: null,
            style: null,
            url: null,
        },
        divider: {
            active: true,
            style: 'default',
        },
        videoUrl: null,
        active: true,
        orderId: null,
        image: null,
        gallery: null,
    };
};
const resetSubChildrenValues = async () => {
    subChild.value = {
        eventSectionPageId: isOpen && children.value?.id,
        title: null,
        icon: null,
        active: true,
        url: null,
        orderId: null,
        description: null,
        shortDescription: null,
        image: null,
    };
};
const resetItemValues = async () => {
    item.value = {
        id: null,
        title: null,
        name: null,
        slug: null,
        keywords: null,
        description: null,
        image: null,
        active: true,
        orderId: null,
    };
};
async function closeModal() {
    isOpen.value = false;
    editMode.value = false;
    s$.value.$reset();
    await resetChildrenValues();
}
async function closeSubChildModal() {
    isOpenSubChild.value = false;
    editModeSubChild.value = false;
    i$.value.$reset();
    await resetSubChildrenValues();
}
async function openModal(id = null) {
    formLoading.value = true;
    if (id !== null) {
        editMode.value = true;
        await fetchChildren(id);
    } else {
        editMode.value = false;
    }
    formLoading.value = false;
    isOpen.value = true;
}
async function openSubChildModal(id = null) {
    formLoading.value = true;
    if (id !== null) {
        editModeSubChild.value = true;
        await fetchSubChildren(id);
    } else {
        editModeSubChild.value = false;
    }
    formLoading.value = false;
    isOpenSubChild.value = true;
}
async function updateItem() {
    const { data, error } = await useApiFetch(`/api/event-page/${item.value.id}`, {
        method: 'PUT',
        body: item,
        lazy: true,
    });
    if (data.value) {
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
        await refresh();
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
}
async function updateChildrenItem() {
    const { data, error } = await useApiFetch(`/api/event-section-page/${children.value.id}`, {
        method: 'PUT',
        body: children,
        lazy: true,
    });
    if (data.value) {
        await refreshPageData();
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
}
async function addSubChild() {
    const { data, error } = await useApiFetch(`/api/event-item`, {
        method: 'POST',
        body: subChild,
        lazy: true,
    });
    if (data.value) {
        useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
        await closeModal();
        await refresh();
    }
    if (error.value) {
        useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
    }
}
async function handleModalSubmit() {
    formLoading.value = true;
    const result = await v$.value.$validate();
    if (!result) {
        formLoading.value = false;
        return false;
    }
    await updateItem();
    formLoading.value = false;
}

async function handleChildrenModalSubmit() {
    formLoading.value = true;
    const result = await s$.value.$validate();
    if (!result) {
        formLoading.value = false;
        return false;
    }
    await updateChildrenItem();
    await closeModal();
    formLoading.value = false;
}

async function handleSubChildrenModalSubmit() {
    formLoading.value = true;
    const result = await s$.value.$validate();
    if (!result) {
        formLoading.value = false;
        return false;
    }
    if (editModeSubChild) {
        await updateChildrenItem();
    } else {
        await addSubChild();
    }
    await closeSubChildModal();
    formLoading.value = false;
}

async function initPageData() {
    await execute();
    if (data.value) {
        item.value = data.value.data;
    }
}

async function refreshPageData() {
    await execute();
    if (data.value) {
        item.value = data.value.data;
    }
}
async function deleteItems() {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if (confirmed) {
        const { data, error } = await useApiFetch(`/api/certificate/delete`, {
            body: { items: selectedRows.value },
            method: 'DELETE',
            lazy: true,
        });
        if (data.value) {
            useToast({ title: 'Success', message: data.value.message, type: 'success', duration: 5000 });
            await refresh();
        }
        if (error.value) {
            useToast({ title: 'Error', message: data.value.message, type: 'error', duration: 5000 });
        }
    }
}
onMounted(async () => {
    loadingPage.value = true;
    await resetItemValues();
    await initPageData();
    loadingPage.value = false;
});
</script>
<template>
    <div>
        <div v-if="!loadingPage" class="flex flex-col gap-8">
            <!-- Page Title & Action Buttons -->
            <div class="md:flex md:items-center md:justify-between md:gap-5">
                <div class="flex items-center gap-2">
                    <Icon name="solar:notes-linear" class="size-5 opacity-75" />
                    <div>{{ item.name }}</div>
                </div>
                <div class="md:flex md:items-center md:gap-5 md:space-y-0 space-y-5">
                    <button class="btn btn-primary btn-rounded px-6 btn-sm gap-3 md:w-fit w-full md:mt-0 mt-5" @click="openModal()">
                        <Icon name="solar:add-square-linear" class="size-5 opacity-75" />
                        Add New Section
                    </button>
                </div>
            </div>
            <!-- Page Fields -->
            <div class="grid lg:grid-cols-12 gap-5 items-start">
                <div class="lg:col-span-8 grid lg:grid-cols-12 gap-5 items-center bg-white rounded-xl p-5 shadow-sm">
                    <FormInputField v-model="item.name" :errors="v$.name.$errors" class="lg:col-span-6" label="Name" name="name" placeholder="Name" />
                    <FormInputField v-model="item.slug" readonly disabled :errors="v$.slug.$errors" class="lg:col-span-6" label="Slug" name="slug" placeholder="Slug" />
                    <FormInputField v-model="item.keywords" :errors="v$.keywords.$errors" class="lg:col-span-12" label="Keywords" name="keywords" placeholder="Keywords" type="textarea" />
                    <FormInputField v-model="item.description" :errors="v$.description.$errors" class="lg:col-span-12" label="Description" name="description" placeholder="Description" type="textarea" />
                    <div class="lg:col-span-12">
                        <button :disabled="formLoading" class="w-full btn-rounded btn-sm btn btn-primary px-4" type="button" @click="handleModalSubmit()">
                            <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:check-circle-broken'" class="w-5 h-5 mr-2" />
                            <span v-html="'Update'" />
                        </button>
                    </div>
                </div>
                <div class="lg:col-span-4 bg-white rounded-xl p-5 shadow-sm">
                    <FormUploader v-model="item.image" :errors="v$.image.$errors" :allowed-types="['image']" label="Cover Image" name="image" />
                </div>
            </div>
            <!-- Sections -->
            <div>
                <div class="flex items-center gap-2">
                    <Icon name="solar:server-outline" class="size-5 opacity-75" />
                    <div>Page Sections</div>
                </div>
                <table class="table table-report font-light">
                    <tbody>
                        <tr v-for="section in item.sections" :key="section.id" class="text-sm">
                            <td class="font-normal">
                                <div>{{ section.name }}</div>
                                <div class="font-light text-sm opacity-75">{{ section.slug }}</div>
                            </td>
                            <td>
                                <FormSwitch :id="'section-active-' + section.id" v-model="section.active" @change="useToggleSwitch(section.id, 'active', 'event-section-page')" />
                            </td>
                            <td class="text-right">
                                <div>
                                    <button class="btn btn-secondary btn-rounded btn-sm gap-3" @click="openModal(section.id)">
                                        <Icon name="solar:pen-new-round-outline" class="size-4" />
                                        Edit
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else class="flex min-h-dvh items-center place-content-center text-center">
            <div>
                <div class="opacity-75 text-sm animate-pulse">Loading Conference Statistics</div>
                <Icon name="eos-icons:three-dots-loading" class="size-16" />
            </div>
        </div>
        <TheModal :open-modal="isOpen" size="5xl" @close-modal="closeModal()">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="font-medium" v-html="editMode ? 'Update Section' : 'Add New Section'"></div>
                    <Icon class="w-8 h-8 opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300" name="solar:close-square-outline" @click="closeModal" />
                </div>
            </template>
            <template #content>
                <div class="grid grid-cols-12 gap-5">
                    <template v-if="['home_slider'].includes(children.slug)">
                        <FormUploader v-model="children.gallery" :errors="s$.gallery.$errors" class="col-span-12" label="Gallery" :max="24" />
                    </template>
                    <template v-else>
                        <template v-if="!['home_cta', 'home_video'].includes(children.slug)">
                            <FormUploader v-model="children.image" :errors="s$.image.$errors" class="col-span-12" label="Image" :max="1" />
                        </template>
                    </template>
                    <FormInputField v-model="children.name" :errors="s$.name.$errors" class="col-span-12 sm:col-span-6" label="Name" :name="children.slug + '-name-' + children.id" placeholder="Name" />
                    <FormInputField v-model="children.slug" disabled :errors="s$.slug.$errors" class="col-span-12 sm:col-span-6" label="Slug" :name="children.slug + '-slug-' + children.id" placeholder="Slug" />
                    <FormInputField v-model="children.orderId" :errors="s$.orderId.$errors" type="number" class="col-span-12 sm:col-span-6" label="Position" :name="children.slug + '-order-id-' + children.id" placeholder="Position" />
                    <FormSwitch
                        v-model="children.active"
                        :class="['home_cta', 'agenda_cta', 'visa_cta', 'pricing_cta', 'pricing_cta_bottom', 'venue_cta', 'contact_cta', 'tos_cta', 'login_cta'].includes(children.slug) ? 'sm:col-span-3 col-span-12' : 'sm:col-span-6 col-span-12'"
                        label="Active"
                        :name="children.slug + '-active-' + children.id"
                    />
                    <template v-if="['home_cta', 'agenda_cta', 'visa_cta', 'pricing_cta', 'pricing_cta_bottom', 'venue_cta', 'contact_cta', 'tos_cta', 'login_cta'].includes(children.slug)">
                        <FormSwitch v-model="children.default" class="sm:col-span-3 col-span-12" label="Default" :name="children.slug + '-default-' + children.id" />
                    </template>
                    <template v-if="['home_about', 'home_slider', 'home_venue', 'home_sponsors', 'pricing_tables', 'pricing_packages', 'pricing_sponsorship_items', 'pricing_vip_tables'].includes(children.slug)">
                        <FormInputField v-model="children.postTitle" :errors="s$.postTitle.$errors" class="col-span-12" label="Post Title" :name="children.slug + '-post-title-' + children.id" placeholder="Post Title" />
                    </template>
                    <template v-if="!['home_video', 'visa_content', 'venue_content'].includes(children.slug)">
                        <FormInputField v-model="children.title" :errors="s$.title.$errors" class="col-span-12" label="Title" :name="children.slug + '-title-' + children.id" placeholder="Title" />
                    </template>
                    <template v-if="['home_slider', 'home_venue'].includes(children.slug)">
                        <FormInputField v-model="children.subTitle" :errors="s$.subTitle.$errors" class="col-span-12" label="Sub Title" :name="children.slug + '-sub-title-' + children.id" placeholder="Description" />
                    </template>
                    <FormInputField
                        v-model="children.description"
                        :errors="s$.description.$errors"
                        class="col-span-12"
                        label="Description"
                        :name="children.slug + '-description-' + children.id"
                        placeholder="Description"
                        :type="['home_sponsors', 'home_slider', 'home_video'].includes(children.slug) ? 'text' : 'textarea'"
                    />
                    <template v-if="['home_video', 'hotel_video'].includes(children.slug)">
                        <FormInputField v-model="children.videoUrl" :errors="s$.videoUrl.$errors" class="col-span-12" label="Video Url" :name="children.slug + '-video-url-' + children.id" placeholder="Video Url" />
                    </template>
                    <template v-if="['home_sponsors', 'pricing_tables', 'pricing_packages', 'home_video'].includes(children.slug)">
                        <FormInputField
                            v-model="children.shortDescription"
                            :errors="s$.shortDescription.$errors"
                            class="col-span-12"
                            label="['home_video'].includes(children.slug) ? 'Video URL 2' : Short Description"
                            :name="children.slug + '-short-description-' + children.id"
                            placeholder="Short Description"
                            :type="['home_sponsors', 'home_slider', 'home_video'].includes(children.slug) ? 'text' : 'textarea'"
                        />
                    </template>
                    <template v-if="['home_slider', 'home_venue', 'home_cta', 'agenda_cta', 'pricing_cta', 'pricing_cta_bottom', 'visa_content', 'visa_cta', 'venue_content', 'venue_cta'].includes(children.slug)">
                        <FormSwitch v-model="children.buttonOneActive" flex-title class="col-span-12" label="Button One Active" :name="children.slug + '-button-one-active-' + children.id" />
                        <template v-if="children.buttonOneActive">
                            <div class="col-span-12 rounded-md p-5 border border-slate-100 grid grid-cols-12 gap-5 bg-slate-50">
                                <FormInputField v-model="children.buttonOne.label" class="col-span-12 sm:col-span-6" label="Label" :name="children.slug + '-button-one-label-' + children.id" placeholder="Label" />
                                <FormInputField v-model="children.buttonOne.icon" class="col-span-12 sm:col-span-6" label="Icon" :name="children.slug + '-button-one-icon-' + children.id" placeholder="Icon" />
                                <FormSelectField
                                    v-model="children.buttonOne.style"
                                    labelvalue="name"
                                    keyvalue="id"
                                    :select-data="buttonStyles"
                                    class="col-span-12 sm:col-span-6"
                                    label="Button Style"
                                    :name="children.slug + '-button-one-style-' + children.id"
                                    placeholder="Button Style"
                                />
                                <FormSelectField
                                    v-model="children.buttonOne.target"
                                    labelvalue="name"
                                    keyvalue="id"
                                    :select-data="buttonTargets"
                                    class="col-span-12 sm:col-span-6"
                                    label="Target"
                                    :name="children.slug + '-button-one-target-' + children.id"
                                    placeholder="Target"
                                />
                                <FormInputField v-model="children.buttonOne.url" class="col-span-12 sm:col-span-6" label="Link" :name="children.slug + '-button-one-url-' + children.id" placeholder="Link" />
                            </div>
                        </template>
                    </template>
                    <template v-if="['home_venue', 'home_cta', 'agenda_cta', 'pricing_cta', 'pricing_cta_bottom', 'visa_content', 'visa_cta', 'venue_content', 'venue_cta'].includes(children.slug)">
                        <FormSwitch v-model="children.buttonTwoActive" flex-title class="col-span-12" label="Button Two Active" :name="children.slug + '-button-two-active-' + children.id" />
                        <template v-if="children.buttonTwoActive">
                            <div class="col-span-12 rounded-md p-5 border border-slate-100 grid grid-cols-12 gap-5 bg-slate-50">
                                <FormInputField v-model="children.buttonTwo.label" class="col-span-12 sm:col-span-6" label="Label" :name="children.slug + '-button-two-label-' + children.id" placeholder="Label" />
                                <FormInputField v-model="children.buttonTwo.icon" class="col-span-12 sm:col-span-6" label="Icon" :name="children.slug + '-button-two-icon-' + children.id" placeholder="Icon" />
                                <FormSelectField
                                    v-model="children.buttonTwo.style"
                                    labelvalue="name"
                                    keyvalue="id"
                                    :select-data="buttonStyles"
                                    class="col-span-12 sm:col-span-6"
                                    label="Button Style"
                                    :name="children.slug + '-button-two-style-' + children.id"
                                    placeholder="Button Style"
                                />
                                <FormSelectField
                                    v-model="children.buttonTwo.target"
                                    labelvalue="name"
                                    keyvalue="id"
                                    :select-data="buttonTargets"
                                    class="col-span-12 sm:col-span-6"
                                    label="Target"
                                    :name="children.slug + '-button-two-target-' + children.id"
                                    placeholder="Target"
                                />
                                <FormInputField v-model="children.buttonTwo.url" class="col-span-12 sm:col-span-6" label="Link" :name="children.slug + '-button-two-url-' + children.id" placeholder="Link" />
                            </div>
                        </template>
                    </template>
                    <template v-if="children && children.items?.length > 0">
                        <div class="font-medium text-base mt-5 col-span-12">
                            <div class="flex items-center w-full pb-3 border-b justify-between">
                                <div class="flex items-center">
                                    <Icon name="solar:clipboard-list-outline" class="w-5 h-5 mr-2" />
                                    <span>Section Items</span>
                                </div>
                                <div>
                                    <button class="btn btn-primary btn-sm btn-rounded" :disabled="formLoading" type="button">
                                        <Icon name="solar:add-circle-outline" class="w-5 h-5 mr-2" />
                                        Add Item
                                    </button>
                                </div>
                            </div>
                            <div v-for="(childItem, itemIndex) in children.items" :key="itemIndex" class="mt-3 text-sm border rounded-xl shadow-sm bg-white p-5 grid md:grid-cols-3 grid-cols-1 items-center justify-between gap-8">
                                <div class="ont-medium">
                                    <div class="truncate">{{ childItem.title ? childItem.title : childItem.description }}</div>
                                </div>
                                <div class="sm:flex sm:place-content-center text-sm">
                                    <FormSwitch
                                        v-model="childItem.active"
                                        flex-title
                                        :class="!childItem.active ? 'text-danger' : 'text-success'"
                                        :name="'item-toggle-active-' + childItem.id"
                                        :label="childItem.active ? 'Active' : 'Inactive'"
                                        @change="useToggleSwitch(childItem.id, 'active', 'event-item')"
                                    />
                                </div>
                                <div class="sm:col-span-1 col-span-3 shrink-0 sm:flex sm:place-content-end">
                                    <button class="sm:w-fit w-full btn btn-secondary btn-sm btn-rounded" type="button" @click="openSubChildModal(childItem.id)">
                                        <Icon name="solar:pen-new-round-outline" class="h-4 w-4 mr-2" />
                                        <span>Edit</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                    <TheModal :open-modal="isOpenSubChild" size="5xl" @close-modal="closeSubChildModal()">
                        <template #header>
                            <div class="flex justify-between items-center">
                                <div class="font-medium" v-html="editModeSubChild ? 'Update Section' : 'Add New Section'"></div>
                                <Icon class="w-8 h-8 opacity-50 cursor-pointer hover:opacity-100 ease-in-out duration-300" name="solar:close-square-outline" @click="closeSubChildModal" />
                            </div>
                        </template>
                        <template #content>
                            <div class="grid grid-cols-12 gap-5">
                                <FormUploader v-model="subChild.image" :errors="i$.image.$errors" class="col-span-12" label="Image" :max="1" />
                                <FormInputField v-model="subChild.title" type="text" :errors="i$.title.$errors" class="col-span-12" label="Title" :name="'item-title'" placeholder="Title" />
                                <FormInputField v-model="subChild.icon" type="text" :errors="i$.icon.$errors" class="col-span-12 sm:col-span-4" label="Icon" :name="'item-icon'" placeholder="Icon" />
                                <FormInputField v-model="subChild.orderId" :errors="i$.orderId.$errors" type="number" class="col-span-12 sm:col-span-4" label="Position" name="'item-order-id'" placeholder="Position" />
                                <FormSwitch v-model="subChild.active" class="col-span-12 sm:col-span-4" label="Active" :name="'item-active'" />
                                <FormInputField v-model="subChild.url" type="text" :errors="i$.url.$errors" class="col-span-12" label="Link" :name="'item-link'" placeholder="Link" />
                                <FormInputField v-model="subChild.description" :errors="i$.description.$errors" type="textarea" class="col-span-12" label="Description" :name="'item-description'" placeholder="Description" />
                            </div>
                        </template>
                        <template #footer>
                            <div class="w-full flex items-center justify-end gap-5">
                                <button :disabled="formLoading" class="btn-rounded btn-sm btn btn-danger px-4" type="button" @click="closeSubChildModal">
                                    <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:close-circle-linear'" class="w-5 h-5 mr-2" />
                                    <span>Close</span>
                                </button>
                                <button :disabled="formLoading" class="btn-rounded btn-sm btn btn-primary px-4" type="button" @click="handleChildrenModalSubmit()">
                                    <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:check-circle-broken'" class="w-5 h-5 mr-2" />
                                    <span v-html="editModeSubChild ? 'Update' : 'Save'" />
                                </button>
                            </div>
                        </template>
                    </TheModal>
                </div>
            </template>
            <template #footer>
                <div class="w-full flex items-center justify-end gap-5">
                    <button :disabled="formLoading" class="btn-rounded btn-sm btn btn-danger px-4" type="button" @click="closeModal">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:close-circle-linear'" class="w-5 h-5 mr-2" />
                        <span>Close</span>
                    </button>
                    <button :disabled="formLoading" class="btn-rounded btn-sm btn btn-primary px-4" type="button" @click="handleChildrenModalSubmit()">
                        <Icon :name="formLoading ? 'svg-spinners:3-dots-fade' : 'solar:check-circle-broken'" class="w-5 h-5 mr-2" />
                        <span v-html="editMode ? 'Update' : 'Save'" />
                    </button>
                </div>
            </template>
        </TheModal>
    </div>
</template>
