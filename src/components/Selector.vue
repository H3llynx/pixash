<script setup lang="ts">

defineProps<{ legend: string }>();
</script>
<template>
    <fieldset class="default-padding flex flex-wrap">
        <legend>{{ legend }}</legend>
        <slot></slot>
    </fieldset>
</template>