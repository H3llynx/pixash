<script setup lang="ts">
import { AlertCircle, Check } from '@lucide/vue';

const props = defineProps<{
    id: string
    label: string
    modelValue: string
}>();
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
    <label :for="id">
        <p>{{ label }}</p>
        <div class="input-container">
            <select :value="modelValue" @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
                v-bind="$attrs" :id="id">
                <slot />
            </select>
            <Check class="check-icon" />
            <AlertCircle class="error-icon" />
        </div>
    </label>
</template>

<style scoped>
select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    height: 2.5rem;
    padding: 0 1rem;
    border-radius: 2rem;
    text-transform: capitalize;
}
</style>