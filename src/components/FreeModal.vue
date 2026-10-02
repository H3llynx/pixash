<script setup lang="ts">
import { tv } from 'tailwind-variants';
import { ref, Transition, watch } from 'vue';

defineProps<{
    size?: keyof typeof dialog.variants.size
    color?: keyof typeof dialog.variants.color
}>();;

const dialogRef = ref<HTMLDialogElement>();
const visible = defineModel<boolean>();

const dialog = tv({
    base: "dialog-overlay w-[80%]",
    variants: {
        size: {
            sm: "max-w-sm",
            md: "md-modal",
        },
        color: {
            default: "",
            secondary: "secondary-modal"
        }
    },
    defaultVariants: {
        size: "sm",
        color: "default"
    }
});

const openDialog = async () => {
    dialogRef.value?.showModal();
};
const closeDialog = () => {
    dialogRef.value?.close();
};

watch(visible, (visible) => visible ? openDialog() : closeDialog());
</script>

<template>
    <dialog ref="dialogRef" @click.self="closeDialog" @close="visible = false" :class="dialog({ size, color })">
        <transition name="toast">
            <div v-if="visible" class="dialog-box">
                <slot />
            </div>
        </Transition>
    </dialog>
</template>

<style scoped>
.md-modal {
    width: 500px;
    overflow: hidden;
}

.md-modal .dialog-box {
    padding: 0;
    gap: 0;
}

.secondary-modal .dialog-box {
    background: var(--color-bg);
    color: var(--color-text-softer);
}
</style>