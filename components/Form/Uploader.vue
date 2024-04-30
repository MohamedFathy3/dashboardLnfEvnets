<script setup lang="ts">
const props = defineProps({
    label: {
        type: String,
        default: null,
    },
    name: {
        type: String,
        default: null,
    },
    required: {
        type: Boolean,
        default: false,
    },
    flexTitle: {
        type: Boolean,
        default: false,
    },
    modelValue: {
        type: Object || null,
        default: null,
    },
    allowedTypes: {
        type: Array,
        required: true,
        default: () => [], // Default allowed file types
    },
    errors: {
        type: Array,
        default: () => [], // Default allowed file types
    },
    maxSize: {
        type: Number,
        default: 5, // Default to 5 MB
    },
});
const validationError = ref(false);
const maxSizeMessage = ref(false);
const maxFileTypeMessage = ref(false);

const types = {
    image: ['image/gif', 'image/png', 'image/webp', 'image/jpeg', 'image/jpg'],
    svg: ['image/svg+xml'],
    audio: ['audio/mpeg', 'audio/aac', 'audio/wav'],
    video: ['video/mp4', 'video/webm', 'video/mpeg', 'video/x-msvideo'],
    document: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'],
    archive: ['application/zip', 'application/x-7z-compressed', 'application/gzip', 'application/vnd.rar'],
};
function getSubtypes(category: string): string[] {
    const subtypes: string[] = [];
    const categoryTypes = (types as Record<string, string[]>)[category];

    if (categoryTypes) {
        categoryTypes.forEach((type: string) => {
            const typeRegex = /\/(.+)$/;
            const match = type.match(typeRegex);
            if (match) {
                subtypes.push(match[1]);
            }
        });
    }

    return subtypes;
}

function resetErrors() {
    maxSizeMessage.value = false;
    maxFileTypeMessage.value = false;
    validationError.value = false;
}
function validateFile($event: DragEvent | InputEvent) {
    const fileInput = $event instanceof DragEvent ? $event.dataTransfer?.files?.[0] : $event.target instanceof HTMLInputElement ? $event.target.files?.[0] : undefined;
    resetErrors();

    let isValid = true;

    if (!fileInput) {
        isValid = false;
    }

    // Check file size
    if (fileInput?.size && fileInput.size > props.maxSize * 1024 * 1024) {
        maxSizeMessage.value = true;
        isValid = false;
    }

    // Check file type
    const isValidType = props.allowedTypes.some((category) => {
        const categoryTypes = types[category as keyof typeof types];
        return categoryTypes && categoryTypes.includes(fileInput?.type || '');
    });

    if (!isValidType) {
        maxFileTypeMessage.value = true;
        isValid = false;
    }

    return isValid;
}

// function determineFileType(fileType: string) {
//     // Map the given file type to the corresponding category
//     for (const [category, categoryTypes] of Object.entries(types)) {
//         if (categoryTypes.includes(fileType)) {
//             return category;
//         }
//     }
//     return null; // Default to null if the type doesn't match any category
// }

type UploadResponse = {
    id: number;
    preview_url: string;
    full_url: string;
};

type ShowFile = {
    data: {
        id: number;
        name: string;
        file_name: string;
        mime_type: string;
        size: number;
        created_at: string;
        preview_url: string;
        url: string;
        full_url: string;
    };
};

const emit = defineEmits(['update:model-value']);
const dragging = ref(false);
const uploading = ref(false);

const file: Ref<null | UploadResponse | ShowFile | undefined> = ref();
const value: Ref<null | number | undefined> = ref(props.modelValue ? props.modelValue.id : null);

async function onDropFile($event: DragEvent) {
    if (!validateFile($event)) {
        validationError.value = true;
        dragging.value = false;
        return;
    }
    resetErrors();
    uploading.value = true;
    const fileInput = $event.dataTransfer?.items[0]?.getAsFile();
    if (fileInput) {
        const formData = new FormData();
        formData.append('file', fileInput);

        const { data } = await useApiFetch('/api/media', {
            method: 'POST',
            body: formData,
            lazy: true,
        });

        if (data && data.value) {
            file.value = data.value as UploadResponse;
            value.value = (data.value as UploadResponse).id;
            emit('update:model-value', value.value);
            uploading.value = false;
            dragging.value = false;
        }
    }
}

async function onUploadFile($event: InputEvent): Promise<void> {
    if (!validateFile($event)) {
        validationError.value = true;
        return;
    }
    resetErrors();
    uploading.value = true;

    const fileInput = $event.target as HTMLInputElement;
    const formData = new FormData();

    if (fileInput.files && fileInput.files[0]) {
        formData.append('file', fileInput.files[0]);
    } else {
        // Handle case where there are no files
        return;
    }

    const { data } = await useApiFetch('/api/media', {
        method: 'POST',
        body: formData,
        lazy: true,
    });

    if (data && data.value) {
        file.value = data.value as UploadResponse;
        value.value = (data.value as UploadResponse).id;
        emit('update:model-value', value.value);
        uploading.value = false;
    }
}

watchEffect(() => {
    value.value = props.modelValue ? props.modelValue.id : null;
});

async function getFile(id: number) {
    uploading.value = true;
    const { data } = await useApiFetch(`/api/media/${id}`);
    if (data && (data.value as ShowFile).data) {
        file.value = (data.value as ShowFile).data;
        uploading.value = false;
    }
}

watch(
    () => props.modelValue,
    (newVal, oldVal) => {
        if (newVal !== oldVal) {
            value.value = newVal && newVal.id !== undefined ? newVal.id : null;
        } else if (newVal === undefined || newVal === null) {
            value.value = null;
        }
    },
);

function removeFile() {
    uploading.value = true;
    file.value = null;
    value.value = null;
    emit('update:model-value', value.value);
    uploading.value = false;
}

onMounted(async () => {
    if (value.value) {
        await getFile(value.value);
    }

    props.allowedTypes.forEach((type) => {
        if (typeof type === 'string') {
            getSubtypes(type);
        }
    });
});
</script>
<template>
    <div class="relative" @drop.prevent="onDropFile" @dragover.prevent="dragging = true" @dragleave.prevent="dragging = false">
        <div v-if="label" class="form-label" :class="[flexTitle ? '!text-left sm:w-20' : '']">
            <span>{{ label }}</span>
            <span v-if="label && required" class="ml-1 text-sm text-danger">*</span>
        </div>
        <div v-if="file && file.full_url" class="relative group bg-white flex justify-center ease-in-out duration-300 px-6 pt-5 pb-6 rounded-xl">
            <div class="absolute inset-0 hidden group-hover:flex items-center justify-center z-10 ease-in-out duration-300 group gap-5">
                <label :for="name + '-update-file'" class="btn btn-primary btn-rounded whitespace-nowrap btn-sm">
                    <Icon name="solar:gallery-send-broken" class="h-5 w-5 mr-2" />
                    <span class="font-semibold">Update Image</span>
                    <input :id="name + '-update-file'" :name="name + '-update-file'" type="file" class="sr-only" @change="onUploadFile" />
                </label>
                <button type="button" class="btn btn-danger btn-rounded group btn-sm" @click="removeFile">
                    <Icon name="clarity:close-line" class="mr-2 w-5 h-5" />
                    <span>Remove</span>
                </button>
            </div>
            <NuxtImg :src="file.full_url" alt="company-logo" class="z-5 w-full h-36 group-hover:blur-md object-contain ease-in-out duration-300" />
        </div>
        <div v-else-if="uploading" class="bg-white flex justify-center ease-in-out duration-300 px-6 pt-5 pb-6 rounded-xl min-h-36">
            <Icon name="eos-icons:three-dots-loading" class="h-14 w-14" />
        </div>
        <div v-else :class="label ? 'mt-2' : ''">
            <div
                :class="[
                    validationError || props.errors.length > 0 ? '!border-dashed !border-danger' : '',
                    dragging ? 'border-solid !border-primary bg-primary/25' : 'border-dashed border-slate-300 dark:!border-slate-600',
                    'border-2 flex justify-center ease-in-out duration-300 px-6 pt-5 pb-6 rounded-xl min-h-36',
                ]"
            >
                <div class="space-y-2 text-center">
                    <Icon name="solar:gallery-send-broken" class="mx-auto h-12 w-12 text-slate-400" />
                    <div class="text-sm space-y-2">
                        <label :for="name" class="relative btn btn-sm btn-primary whitespace-nowrap">
                            <span>Upload a file</span>
                            <input :id="name" :name="name" type="file" class="sr-only" @change="onUploadFile" />
                        </label>
                        <p class="pl-1">or drag and drop</p>
                    </div>
                    <div class="text-xs text-slate-400 text-center">
                        <span v-for="(allowedType, index) in props.allowedTypes" :key="index" class="">
                            <template v-for="(mimeType, mimeIndex) in getSubtypes(allowedType)" :key="mimeIndex">
                                <span class="uppercase font-semibold">{{ mimeType }}{{ mimeIndex < getSubtypes(allowedType).length - 1 ? ', ' : '' }}</span>
                            </template>
                            {{ index < props.allowedTypes.length - 1 ? ', ' : '' }}
                        </span>
                        <div class="mt-1">
                            <span class="mx-1">Max file size is: </span>
                            <span class="font-semibold">{{ props.maxSize + ' MB' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template v-if="props.errors.length > 0 || validateFile">
            <ul class="mt-3 text-sm text-danger divide-y divide-dashed !divide-danger/25 font-medium">
                <li v-if="maxSizeMessage" class="py-2">{{ 'Maximum size is ' + props.maxSize + ' MB' }}</li>
                <li v-if="maxFileTypeMessage" class="py-2">
                    <span>Allowed Types:</span>
                    <span v-for="(allowedType, index) in props.allowedTypes" :key="index" class="ml-1">
                        <template v-for="(mimeType, mimeIndex) in getSubtypes(allowedType)" :key="mimeIndex">
                            <span class="uppercase font-semibold">{{ mimeType }}{{ mimeIndex < getSubtypes(allowedType).length - 1 ? ', ' : '' }}</span>
                        </template>
                        {{ index < props.allowedTypes.length - 1 ? ', ' : '' }}
                    </span>
                </li>
                <template v-if="errors.length > 0">
                    <li v-for="(error, errorIndex) in errors" :key="errorIndex" class="py-2">{{ error.$message }}</li>
                </template>
            </ul>
        </template>
    </div>
</template>
