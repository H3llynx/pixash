<script setup lang="ts">

defineProps<{
    id: string
    label: string
    modelValue: string | undefined
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
        </div>
    </label>
</template>

<style scoped>
select {
    height: 2.8rem;
    padding: 0 1rem;
    border-radius: 0.75rem;
    text-transform: capitalize;
    background: var(--color-bg);

    &:user-invalid {
        outline-width: 2px;
        outline-style: solid;
        outline-offset: 1px;
        outline-color: var(--color-error-border);
        border-radius: 5px;
    }
}
</style>