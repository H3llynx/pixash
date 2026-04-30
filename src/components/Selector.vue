<script setup lang="ts">

defineProps<{ legend: string }>();
</script>
<template>
    <fieldset class="default-padding flex flex-wrap">
        <legend>{{ legend }}</legend>
        <slot></slot>
    </fieldset>
</template>

<style scoped>
legend,
:deep(label p),
:deep(label span) {
    font-size: medium;
}

:deep(fieldset label p) {
    font-size: 14px;
}
</style>