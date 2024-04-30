<script setup>
import VueSelect from 'vue-select';
const props = defineProps({
    id: {
        type: String,
        default: null,
    },
    size: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    rounded: {
        type: Boolean,
        default: false,
    },
    autofocus: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: 'text',
    },
    autocomplete: {
        type: String,
        default: 'off',
    },
    icon: {
        type: String,
        default: '',
    },
    flexTitle: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        default: '',
    },
    prefix: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: '',
    },
    searchable: {
        type: Boolean,
        default: false,
    },
    clearable: {
        type: Boolean,
        default: true,
    },
    selectable: {
        type: Function,
        default: () => true,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    errors: {
        type: Array,
        default: () => [],
    },
    required: {
        type: Boolean,
        default: false,
    },
    isRoundedImage: {
        type: Boolean,
        default: false,
    },
    modelValue: {
        type: Object,
        default: null,
    },
    selectData: {
        type: Array,
        default: () => [],
    },
});
const emit = defineEmits(['update:model-value']);
const value = ref(props.modelValue);
onMounted(() => {
    value.value = props.modelValue;
});

watchEffect(() => {
    emit('update:model-value', value.value);
});
</script>

<template>
    <div class="text-base" :class="[flexTitle ? 'form-inline' : '']">
        <div v-if="label" class="form-label font-medium" :class="[flexTitle ? '!text-left sm:w-20' : '']">
            <span>{{ label }}</span>
            <span v-if="label && required" class="ml-1 text-sm text-danger">*</span>
        </div>
        <div class="relative flex items-stretch grow focus-within:z-10">
            <VueSelect
                :id="name"
                v-model="value"
                :disabled="disabled"
                class="grow"
                :readonly="readonly"
                :placeholder="placeholder"
                :required="required"
                :name="name"
                :is-rounded-image="isRoundedImage"
                :clearable="clearable"
                :autocomplete="autocomplete"
                :selectable="selectable"
                :multiple="multiple"
                :label="$attrs.labelvalue"
                :img-value="$attrs.imgvalue"
                :secondlabel-value="$attrs.secondlabelvalue"
                :thirdlabel-value="$attrs.thirdlabelvalue"
                :reduce="(data) => data[$attrs.keyvalue]"
                :options="selectData"
            >
                <template #option="option">
                    <div class="text-sm group flex items-center py-1.5 hover:bg-primary rounded-full px-4 ease-in-out duration-100 cursor-pointer first:border-t-0 last:border-b-0 truncate border-y border-dashed border-slate-100">
                        <img v-if="$attrs.imgvalue" :class="[isRoundedImage ? 'rounded-full w-5 h-5' : 'rounded-sm w-6 h-4', 'mr-2 object-cover']" :src="option[$attrs.imgvalue]" :alt="option[$attrs.labelvalue]" :title="option[$attrs.labelvalue]" />
                        <span v-if="prefix !== null || prefix !== ''" class="group-hover:text-slate-100">{{ prefix }}</span>
                        <span class="group-hover:text-slate-100">{{ option[$attrs.labelvalue] }}</span>
                        <span v-if="$attrs.secondlabelvalue" class="font-light ml-0.5 group-hover:text-slate-100 opacity-75">, {{ option[$attrs.secondlabelvalue] }}</span>
                        <span v-if="$attrs.thirdlabelvalue" class="font-light ml-0.5 group-hover:text-slate-100 opacity-75">, {{ option[$attrs.thirdlabelvalue] }}</span>
                    </div>
                </template>
                <template #selected-option="{ name, key, image_url }">
                    <div :class="[icon ? 'pl-5' : '', 'flex items-center whitespace-nowrap truncate text-sm']">
                        <img v-if="$attrs.imgvalue" :class="[isRoundedImage ? 'rounded-full w-5 h-5' : 'rounded-sm w-6 h-4', 'mr-2 object-cover']" :src="image_url" :alt="name" :title="name" />
                        <div v-if="prefix" class="truncate">{{ prefix }}</div>
                        <div v-if="$attrs.labelvalue === 'name'" class="truncate font-medium">{{ name }}</div>
                        <div v-if="$attrs.labelvalue === 'key'" class="truncate">{{ key }}</div>
                    </div>
                </template>
                <template #search="{ attributes, events }">
                    <div v-if="icon" class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon :name="icon" class="h-5 w-5 text-slate-400 dark:text-slate-600" />
                    </div>
                    <label :for="name" class="sr-only">{{ label }}</label>
                    <input :id="name" :class="[icon ? 'pl-10' : 'pl-4', errors.length > 0 ? 'border !border-danger' : '', 'vs__search form-control form-control-rounded dark:placeholder:!text-slate-400']" v-bind="attributes" v-on="events" />
                </template>
            </VueSelect>
        </div>
        <div v-if="description" class="form-help !text-slate-400 ml-4" v-html="description" />
        <template v-if="errors.length > 0">
            <ul class="mt-1">
                <li v-for="(error, errorIndex) in errors" :key="errorIndex" class="text-sm text-danger">{{ error.$message }}</li>
            </ul>
        </template>
    </div>
</template>
<style lang="scss">
.vs__dropdown-menu {
    @apply absolute z-40 mt-4 p-3 max-h-52 w-full overflow-x-hidden overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border;
}

.vs__selected-options {
    @apply border-0 grow inset-0;
}

.vs__selected {
    @apply absolute py-1.5 mx-5 inset-0 mr-14 flex items-center space-x-2;
}

.vs--multiple .vs__deselect {
    @apply fill-slate-400;
}

.vs__search {
    @apply rounded-full;
}

.vs--searching .vs__selected,
.vs--open .vs__selected {
    @apply opacity-10 ease-in-out duration-150;
}

.vs--multiple .vs__selected-options {
    @apply flex items-center gap-3;
}

.vs--single .vs__selected-options {
    //@apply flex items-center gap-3
}

.vs__actions {
    @apply fill-slate-400;
}

.vs--open .vs__actions .vs__open-indicator {
    @apply ease-in-out duration-300 rotate-180;
}

.vs__clear {
    @apply absolute right-10;
}

.vs__dropdown-toggle {
    //@apply border border-slate-200 rounded-full shadow-sm;
    @apply flex items-center space-x-2 relative w-full;
}
</style>
