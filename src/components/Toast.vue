<script setup lang="ts">
import { AlertCircle, CheckCircle2, X } from '@lucide/vue';
import { tv } from 'tailwind-variants';
import { useToast } from '../composables/useToast';
const { toast, dismiss } = useToast();

const toastBox = tv({
    base: "flex px-0.5 py-1 gap-0.5 w-full max-w-xs items-start font-inter fixed bottom-4 left-1/2 -translate-x-1/2 border rounded-xl md:bottom-auto md:top-4 md:right-4 md:left-auto md:translate-x-0",
    variants: {
        type: {
            error: "bg-error-bg border-error-border text-error-text",
            success: "bg-success-bg border-success-border text-success-text"
        }
    }
});
</script>

<template>
    <Transition name="toast">
        <div v-if="toast" role="alert" aria-live="polite" aria-atomic="true" :class="toastBox({ type: toast.type })">
            <CheckCircle2 v-if="toast.type === 'success'" fill="var(--color-success)" color="var(--color-success-bg)" />
            <AlertCircle v-else fill="var(--color-error)" color="var(--color-error-bg)" />
            <div>
                <h3 class="text-medium text-lg">{{ toast.title }}</h3>
                <p class="text-sm text-light">{{ toast.message }}</p>
            </div>
            <button @click="dismiss()" aria-label="Dismiss notification">
                <X :size="22"
                    :color="toast.type === 'error' ? 'var(--color-error-border)' : 'var(--color-success-border)'" />
            </button>
        </div>
    </Transition>
</template>