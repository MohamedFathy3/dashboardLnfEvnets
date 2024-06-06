<script setup>
defineProps({
    member: {
        required: true,
        type: Array,
        default: () => [],
    },
});
</script>
<template>
    <div class="">
        <div class="flex items-center justify-between gap-5 mb-3">
            <div class="font-medium flex items-center gap-1.5 whitespace-nowrap">
                <Icon name="solar:cart-5-linear" class="size-5 opacity-75" />
                Orders
            </div>
        </div>
        <ul v-if="member.orders.length > 0 || member.pendingOrder" class="flex flex-col gap-3">
            <li>
                <a v-if="member.pendingOrder" :href="'/conferences-attendees/orders/' + member.pendingOrder.id" class="items-center grid lg:grid-cols-3 gap-3 bg-white rounded-xl p-3 shadow-sm cursor-pointer hover:scale-[101%] transition-all">
                    <div>
                        <div class="font-normal">{{ member.pendingOrder.uuid }}</div>
                        <div class="font-light">{{ member.pendingOrder.createdAt }}</div>
                    </div>
                    <div class="font-medium">{{ member.pendingOrder.amount }}<span class="font-light ml-2">USD</span></div>
                    <div class="flex justify-end">
                        <UiEventOrderStatusBadge :data="member.pendingOrder.status" />
                    </div>
                </a>
            </li>
            <li v-for="order in member.orders" :key="order.id">
                <a :href="'/conferences-attendees/orders/' + order.id" class="items-center grid lg:grid-cols-3 gap-3 bg-white rounded-xl p-3 shadow-sm cursor-pointer hover:scale-[101%] transition-all">
                    <div>
                        <div class="font-normal">{{ order.uuid }}</div>
                        <div class="font-light">{{ order.createdAt }}</div>
                    </div>
                    <div class="font-medium">{{ order.amount }}<span class="font-light ml-2">USD</span></div>
                    <div class="flex justify-end">
                        <UiEventOrderStatusBadge :data="order.status" />
                    </div>
                </a>
            </li>
        </ul>
        <div v-else class="lg:col-span-12 p-5 text-base text-center bg-white border-2 border-dashed font-medium opacity-75">This member has no orders</div>
    </div>
</template>
