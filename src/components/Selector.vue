<script setup lang="ts">

defineProps<{
    legend: string;
    legendHidden?: boolean
}>();
</script>
<template>
    <fieldset class="default-padding flex flex-wrap">
        <legend :class="{ 'sr-only': legendHidden }">{{ legend }}</legend>
        <slot></slot>
    </fieldset>
</template>