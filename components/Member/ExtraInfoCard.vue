<script setup>
const props = defineProps({
    member: {
        required: true,
        type: Object,
        default: () => null,
    },
});

const resources = useResourceStore();
</script>
<template>
    <div class="bg-white rounded-xl p-5 shadow-sm">
        <div class="flex items-center justify-between gap-5 pb-3 border-b">
            <div class="font-medium flex items-center gap-1.5">
                <Icon name="solar:menu-dots-square-outline" class="size-5 opacity-75" />
                Extra Details
            </div>
        </div>
        <ul class="pt-3 divide-y divide-dashed !divide-slate-100 text-sm">
            <li class="py-1.5 flex items-center justify-between min-h-10">
                <div class="flex items-center gap-1.5">
                    <Icon name="solar:bookmark-linear" class="size-4 opacity-75" />
                    Company Type
                </div>
                <UiCompanyTypeBadge :data="props.member.typeCompany" />
            </li>
            <li class="py-1.5 flex flex-col justify-between min-h-10">
                <div class="flex items-center gap-1.5">
                    <Icon name="solar:multiple-forward-left-linear" class="size-4 opacity-75" />
                    Referral
                </div>
                <div class="font-medium ml-6">{{ resources?.referrals.find((r) => r.id === props.member.referralId)?.name }}</div>
                <div v-if="props.member?.refValue" class="font-light ml-6">{{ props.member?.refValue }}</div>
            </li>
            <li class="py-1.5 flex justify-between min-h-10">
                <div class="flex items-center gap-1.5">
                    <Icon name="solar:user-speak-linear" class="size-4 opacity-75" />
                    Agent
                </div>
                <div v-if="props.company?.ref" class="font-medium ml-6">{{ props.company.ref?.name }}</div>
                <div v-else class="font-light ml-6">---</div>
            </li>
            <li class="py-1.5 flex justify-between min-h-10">
                <div class="flex items-center gap-1.5">
                    <Icon name="solar:globus-linear" class="size-4 opacity-75" />
                    Detected Country
                </div>
                <div v-if="props.company?.detectedCountryName" class="font-medium ml-6">{{ props.company?.detectedCountryName }}</div>
                <div v-else class="font-light ml-6">---</div>
            </li>
        </ul>
    </div>
</template>
