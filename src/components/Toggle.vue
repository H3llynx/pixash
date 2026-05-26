<script setup lang="ts">
withDefaults(defineProps<{
    id?: string
    label: string
    modelValue: boolean
    size?: "md" | "sm"
}>(), { size: "md" })

defineEmits(["update:modelValue"]);
</script>

<template>
    <label :for="id" class="flex items-center justify-between cursor-pointer gap-1">
        <span>{{ label }}</span>

        <div :class="['toggle-track',
            size === 'sm'
                ? 'toggle-track-sm'
                : 'toggle-track-md',
            { active: modelValue }
        ]">
            <input type="checkbox" :id="id" class="sr-only" :checked="modelValue" tabindex="0"
                @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)" />
            <div class="toggle-knob"></div>
        </div>
    </label>
</template>

<style scoped>
.toggle-track {
    position: relative;
    border-radius: 2rem;
    background: var(--color-border);

    &:has(:focus-visible) {
        outline-width: 2px;
        outline-style: solid;
        outline-offset: 1px;
        outline-color: var(--color-gold);
    }
}

.toggle-track-md {
    width: 50px;
    height: 25px;
}

.toggle-track-sm {
    width: 36px;
    height: 18px;
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

.toggle-track-sm .toggle-knob {
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
}

.toggle-track-md.active .toggle-knob {
    transform: translateX(25px);
}

.toggle-track-sm.active .toggle-knob {
    transform: translateX(18px);
}
</style>