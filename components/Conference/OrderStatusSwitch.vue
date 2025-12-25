<script setup>
const props = defineProps({
    orderId: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['reload']);

// تعريف الحالات
const orderStatuses = ref([
    { name: 'Application Form', value: 'in_application_form' },
    { name: 'Pending Payment', value: 'pending_payment' },
    { name: 'Pending Bank Transfer', value: 'pending_bank_transfer' },
    { name: 'Approved Online Payment', value: 'approved_online_payment' },
    { name: 'Approved Bank Transfer', value: 'approved_bank_transfer' },
]);

// الحالة الحالية
const currentStatus = ref(props.orderStatus);
const isChanging = ref(false);

// دالة تحويل القيمة لاسم
const getStatusName = (statusValue) => {
    const status = orderStatuses.value.find(s => s.value === statusValue);
    return status ? status.name : statusValue;
};

// دالة تغيير الحالة
const changeOrderStatus = async (newStatus) => {
    console.log('🔄 Changing status from', currentStatus.value, 'to:', newStatus);
    
    if (isChanging.value || !newStatus) return;
    
    isChanging.value = true;
    
    try {
        const { data, error } = await useApiFetch(`/api/dashboard/order/${props.orderId}/change-status`, {
            method: 'POST',
            body: { status: newStatus },
        });

        if (data.value) {
            useToast({ 
                title: 'Success', 
                message: `Status changed to ${getStatusName(newStatus)}`, 
                type: 'success', 
                duration: 5000 
            });
            currentStatus.value = newStatus;
            emit('reload');
        }

        if (error && error.value) {
            console.error('❌ Status change error:', error.value);
            useToast({ 
                title: 'Error', 
                message: error.value.message || 'Failed to change status', 
                type: 'error', 
                duration: 5000 
            });
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err);
        useToast({ 
            title: 'Error', 
            message: 'Unexpected error occurred', 
            type: 'error', 
            duration: 5000 
        });
    } finally {
        isChanging.value = false;
    }
};

// تحديث الحالة عند تغيير الـ props
watch(() => props.orderStatus, (newStatus) => {
    console.log('📥 Order status updated from parent:', newStatus);
    currentStatus.value = newStatus;
}, { immediate: true });

// Console log للتحقق
onMounted(() => {
    console.log('✅ ConferenceOrderStatusSwitch mounted');
    console.log('   Order ID:', props.orderId);
    console.log('   Order Status:', props.orderStatus);
    console.log('   Current Status in component:', currentStatus.value);
    console.log('   Disabled:', props.disabled);
    console.log('   Status options:', orderStatuses.value);
});
</script>

<template>
    <div class="conference-order-status-switch relative">
        <!-- Debug info (يمكن إزالته لاحقاً) -->
        <div class="text-xs text-gray-500 mb-1">
            Status: {{ getStatusName(currentStatus) }}
        </div>
        
        <!-- Select عادي -->
        <div class="relative">
            <select
                v-model="currentStatus"
                :disabled="disabled || isChanging"
                @change="changeOrderStatus(currentStatus)"
                class="w-[18rem] px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed appearance-none"
            >
                <option value="" disabled>Please select a status...</option>
                <option 
                    v-for="status in orderStatuses" 
                    :key="status.value" 
                    :value="status.value"
                    :selected="currentStatus === status.value"
                >
                    {{ status.name }}
                </option>
            </select>
            
            <!-- Custom dropdown arrow -->
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Icon name="heroicons:chevron-down" class="w-5 h-5" />
            </div>
        </div>
        
        <!-- Loading indicator -->
        <div v-if="isChanging" class="text-xs text-blue-500 mt-1 animate-pulse">
            Updating status...
        </div>
    </div>
</template>

<style scoped>
/* تحسين مظهر الـ select */
select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}
</style>