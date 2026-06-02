<script setup lang="ts">
import { inject, ref } from 'vue';

withDefaults(defineProps<{
    maxLength?: number;
}>(), { maxLength: 500 });

const readonly = inject("readonly", ref(false));

const text = defineModel<string>();
</script>

<template>
    <div class="flex flex-col gap-0.25">
        <textarea v-model="text" :maxlength="maxLength" :readonly="readonly" />
        <span v-if="!readonly" class="ml-auto text-brand-light text-xs">{{ (text ?? "").length }}/{{ maxLength }}</span>
    </div>
</template>

<style scoped>
span {
    font-size: 12px !important;
}
</style>