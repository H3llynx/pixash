<script setup lang="ts">
import { AlertCircle } from '@lucide/vue';

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<{
    id?: string
    label?: string
    type?: string
    placeholder?: string
    modelValue?: string | boolean | string[]
}>(), {
    type: "text"
});
defineEmits(["update:modelValue"]);
</script>

<template>
    <label :for="id">
        <p v-if="label">{{ label }}</p>
        <div class="input-container">
            <input :id="id" :type="type" :placeholder="placeholder" :value="modelValue" :checked="type === 'radio'
                ? modelValue === ($attrs.value as string)
                : type === 'checkbox'
                    ? Array.isArray(modelValue)
                        ? modelValue.includes($attrs.value as string)
                        : modelValue === ($attrs.value as string)
                    : undefined
                " class="rounded-xl font-medium pl-1 pr-2.5 py-0.5" tabindex="0"
                @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" v-bind="$attrs" />
            <div class="absolute right-[2px] top-1/2 -translate-y-1/2">
                <slot name="addon"></slot>
            </div>
            <AlertCircle class="error-icon" />
        </div>
    </label>
</template>