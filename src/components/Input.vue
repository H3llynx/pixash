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
});
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
    <label :for="id">
        <p v-if="label">{{ label }}</p>
        <div class="input-container">
            <input :id="id" :type="type" :placeholder="placeholder" :value="modelValue"
                class="bg-bg-2 rounded-full font-medium pl-1 pr-2.5 py-0.5"
                @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)" v-bind="$attrs">
            <div class="absolute right-[2px] top-1/2 -translate-y-1/2">
                <slot name="addon"></slot>
            </div>
            <Check class="check-icon" />
            <AlertCircle class="error-icon" />
        </div>
    </label>
</template>