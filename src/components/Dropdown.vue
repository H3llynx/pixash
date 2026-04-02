<script setup lang="ts">
import { AlertCircle } from '@lucide/vue';

defineProps<{
    id: string
    label: string
    modelValue: string
}>();
defineEmits(["update:modelValue"]);
</script>

<template>
    <label :for="id">
        <p>{{ label }}</p>
        <div class="input-container">
            <select :value="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
                v-bind="$attrs" :id="id">
                <slot />
            </select>
            <AlertCircle class="error-icon" />
        </div>
    </label>
</template>

<style scoped>
select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    height: 2.8rem;
    padding: 0 1rem;
    border-radius: 0.75rem;
    text-transform: capitalize;
    background: var(--color-bg);
}

.input-container::after {
    content: "";
    position: absolute;
    pointer-events: none;
    top: 50%;
    right: 0.9rem;
    transform: translateY(-50%);
    border-width: 5px 4px 0 4px;
    border-style: solid;
    border-color: var(--color-border) transparent transparent transparent;
}
</style>