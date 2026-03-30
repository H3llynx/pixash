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
const emit = defineEmits(["update:modelValue"])
</script>

<template>
    <label :for="id">
        <span v-if="label">{{ label }}</span>
        <div class="input-container">
            <input :id="id" :type="type" :placeholder="placeholder" :value="modelValue"
                class="border border-border rounded-full font-medium px-1 py-0.5 w-full mt-0.5"
                @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)" v-bind="$attrs" />
            <Check :size="18" class="check-icon hidden" />
            <AlertCircle class="error-icon hidden" />
        </div>
    </label>
</template>

<style scoped>
label:has(input:required) span::after {
    content: "*";
    margin-left: 3px;
    font-size: x-small;
    vertical-align: text-top;
}

.input-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-top: 0.5;

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