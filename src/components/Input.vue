<script setup lang="ts">
import { AlertCircle } from '@lucide/vue';
import { computed, inject, ref, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
    id?: string
    label?: string
    type?: string
    placeholder?: string
    modelValue?: string | boolean | string[]
}>(), {
    type: "text"
});
const emit = defineEmits(["update:modelValue"]);
const $attrs = useAttrs();

const readonly = inject("readonly", ref(false));
const isTextLike = computed(() => !["checkbox", "radio"].includes(props.type))
const isChoiceLike = computed(() => ["checkbox", "radio"].includes(props.type))

const inputValue = computed(() => {
    if (props.type === "radio" || props.type === "checkbox") return $attrs.value as string;
    return props.modelValue;
});

const inputChecked = computed(() => {
    if (props.type === "radio") return props.modelValue === ($attrs.value as string);
    if (props.type === "checkbox") {
        if (Array.isArray(props.modelValue)) return props.modelValue.includes($attrs.value as string);
        return props.modelValue === ($attrs.value as string);
    }
    return undefined;
});

const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const val = $attrs.value as string;
    if (props.type === "checkbox") {
        if (Array.isArray(props.modelValue)) {
            const exists = props.modelValue.includes(val);
            const next = exists
                ? props.modelValue.filter(v => v !== val)
                : [...props.modelValue, val];

            emit("update:modelValue", next);
        }
    } else {
        emit("update:modelValue", value);
    }
};

</script>

<template>
    <label :for="id">
        <p v-if="label">{{ label }}</p>
        <div class="input-container">
            <input v-bind="$attrs" :id="id" :type="type" :placeholder="placeholder" :value="inputValue"
                :checked="inputChecked" class="font-medium pl-1 pr-2.5 py-0.5" tabindex="0" @change="handleChange"
                @click="readonly ? $event.preventDefault() : null" :readonly="isTextLike && readonly"
                :disabled="isChoiceLike && readonly" />
            <div class="absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center">
                <slot name="addon"></slot>
                <AlertCircle class="error-icon" />
            </div>
        </div>
    </label>
</template>