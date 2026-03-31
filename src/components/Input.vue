<script setup lang="ts">
import { AlertCircle, Check } from '@lucide/vue';

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
    id: string
    label?: string
    type?: string
    placeholder?: string
    modelValue?: string
}>(), {
    type: "text"
})
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
    <label :for="id">
        <p v-if="label" class="mb-0.5">{{ label }}</p>
        <div class="input-container">
            <input :id="id" :type="type" :placeholder="placeholder" :value="modelValue"
                class="border border-border rounded-full font-medium pl-1 pr-2.5 py-0.5 w-full"
                @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)" v-bind="$attrs">
            <div class="absolute right-[2px] top-1/2 -translate-y-1/2">
                <slot name="addon"></slot>
            </div>
            <Check class="check-icon hidden" />
            <AlertCircle class="error-icon hidden" />
        </div>
    </label>
</template>

<style scoped>
label:has(input:required) p::after {
    content: "*";
    margin-left: 3px;
    font-size: x-small;
    vertical-align: text-top;
}

.input-container {
    position: relative;
    display: flex;
    gap: 0.5rem;
    align-items: center;

    svg {
        position: absolute;
        right: -2rem;
        flex-shrink: 0;
    }

    &:has(:user-valid) .check-icon {
        display: block;
        color: var(--color-success);
    }

    &:has(:user-invalid) .error-icon {
        display: block;
        color: var(--color-error);
    }

    input::placeholder {
        font-size: small;
    }
}
</style>