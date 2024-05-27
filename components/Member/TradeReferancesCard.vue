<script setup>
const props = defineProps({
    tradeReferences: {
        required: true,
        type: Array,
        default: () => [],
    },
    memberId: {
        required: true,
        type: Number,
    },
});
const emit = defineEmits(['refresh']);
const isOpen = ref(false);
const selectedIndex = ref(null);
function onSuccessUpdate() {
    emit('refresh');
}
async function openModal(index) {
    selectedIndex.value = index;
    isOpen.value = true;
}
function closeModal() {
    isOpen.value = false;
    selectedIndex.value = undefined;
}
</script>
<template>
    <div>
        <div class="flex items-center justify-between gap-5 mb-3">
            <div class="font-medium flex items-center gap-1.5 whitespace-nowrap">
                <Icon name="solar:global-outline" class="size-5 opacity-75" />
                Trade References
            </div>
        </div>
        <ul v-if="props.tradeReferences.length > 0" class="flex flex-col gap-3">
            <li v-for="(reference, index) in props.tradeReferences" :key="reference.id" class="space-y-0.5 bg-white rounded-xl p-3 shadow-sm cursor-pointer hover:scale-105 transition-all" @click="openModal(index)">
                <div class="flex items-center gap-1.5">
                    <span class="font-medium opacity-85">{{ reference.person }},</span>
                    <span class="font-light">{{ reference.jobTitle }}</span>
                </div>
                <div class="font-light">{{ reference.name }}</div>
                <div class="flex items-center gap-1.5">
                    <NuxtImg :src="reference.country.imageUrl" :alt="reference.country.name" :title="reference.country.name" class="w-6 h-4 object-contain" />
                    <div class="font-light">{{ reference?.country?.name }}</div>
                    <div class="font-light">{{ reference?.city }}</div>
                </div>
            </li>
        </ul>
        <div v-else class="lg:col-span-12 p-5 text-base text-center bg-white border-2 border-dashed font-medium opacity-75">This member has no trade references</div>
        <MemberViewTradeReferenceModal v-if="isOpen" :open="isOpen" :reference="props.tradeReferences[selectedIndex]" @close="closeModal" />
    </div>
</template>
