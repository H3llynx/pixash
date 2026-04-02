<!-- components/AppToggle.vue -->
<script setup lang="ts">
defineProps<{
    id: string;
    label: string;
    modelValue: boolean;
}>()

defineEmits(["update:modelValue"]);
</script>

<template>
    <label :for="id" class="flex items-center justify-between py-0.5 cursor-pointer">
        <span>{{ label }}</span>
        <div class="toggle-track" :class="{ active: modelValue }">
            <input type="checkbox" :checked="modelValue" :id="id" tabindex="0"
                @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)" class="sr-only" />
            <div class="toggle-knob"></div>
        </div>
    </label>
</template>

<style scoped>
@reference "../styles/base.css";

.toggle-track {
    position: relative;
    border-radius: 2rem;
    width: 50px;
    height: 25px;
    background: var(--color-border);

    &:has(:focus-visible) {
        outline-width: 2px;
        outline-style: solid;
        outline-offset: 4px;
        outline-color: var(--color-gold);
    }
}

.toggle-track.active {
    background: var(--color-brand);
}

.toggle-knob {
    position: absolute;
    background: var(--color-white);
    border-radius: 50%;
    top: 2px;
    left: 2px;
    width: 21px;
    height: 21px;
}

.toggle-track.active .toggle-knob {
    transform: translateX(25px);
}
</style>