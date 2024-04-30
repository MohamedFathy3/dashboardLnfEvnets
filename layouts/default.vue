<script lang="ts" setup>

</script>

<template>
    <div class="flex">
        <div>
            <Sidebar/>
        </div>
        <div>
            <div></div>
            <main>
                <slot/>
            </main>
        </div>
    </div>
</template>