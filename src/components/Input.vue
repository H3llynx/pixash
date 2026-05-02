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
        <div :class="{ 'input-container': true, 'hidden': readonly && (type === 'date' || type === 'datetime-local') }"
            :aria-hidden="readonly && (type === 'date' || type === 'datetime-local')">
            <input v-bind="$attrs" :id="id" :type="type" :placeholder="placeholder" :value="inputValue"
                :checked="inputChecked" class="font-medium pl-1 pr-2.5 py-0.5" @change="handleChange"
                @click="readonly && $event.preventDefault()" :readonly="readonly" :aria-readonly="readonly"
                :tabindex="readonly ? -1 : 0" />
            <div class="absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center">
                <slot name="addon"></slot>
                <AlertCircle class="error-icon" />
            </div>
        </div>
        <span :id="id" class="flex font-medium bg-brand-rgba py-0.5 px-1 rounded-xl w-full border border-border"
            v-if="readonly && (type === 'date' || type === 'datetime-local')">{{
                inputValue ? type === 'date'
                    ? new Date(inputValue as string).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    })
                    : new Date(inputValue as string).toLocaleString(undefined, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    : ""
            }}
        </span>
    </label>
</template>