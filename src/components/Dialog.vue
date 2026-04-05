<script setup lang="ts">
import { PawPrint, TriangleAlert } from '@lucide/vue';
import { onClickOutside } from '@vueuse/core';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import { nextTick, ref, watch } from 'vue';
import { useDialog } from '../composables/useDialog';
import Button from './Button.vue';

const dialogRef = ref<HTMLDialogElement>();
const boxRef = ref<HTMLDialogElement>();
const { dialog } = useDialog();

const { activate, deactivate } = useFocusTrap(boxRef);

const openDialog = async () => {
    dialogRef.value?.showModal();
    await nextTick();
    activate();
}
const closeDialog = () => {
    dialog.value = null;
    dialogRef.value?.close();
    deactivate();
}


const handleConfirm = () => {
    if (!dialog.value?.onConfirm) return;
    dialog.value.onConfirm();
    closeDialog();
}

onClickOutside(boxRef, () => closeDialog())

watch(dialog, (newVal) => {
    if (newVal) {
        openDialog()
    } else {
        closeDialog()
    }
}, { immediate: true })
</script>

<template>
    <dialog ref="dialogRef" class="m-auto bg-transparent text-text max-w-xs backdrop:bg-black/40 backdrop:filter-blur"
        :aria-labelledby="dialog?.title">
        <Transition name="modal-pop" appear>
            <div v-if="dialog" ref="boxRef"
                class="bg-bg-3 p-1.5 rounded-2xl text-center border border-border flex flex-col gap-1 items-center">
                <div class="rounded-full w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
                    <TriangleAlert v-if="dialog.isDelete" :size="30" />
                    <PawPrint v-else :size="30" />
                </div>
                <h2>{{ dialog.title }}</h2>
                <p>{{ dialog.message }}</p>
                <div class="flex justify-center gap-0.5 mt-0.5">
                    <Button @click="closeDialog" variant="secondary">{{
                        dialog.cancelText ?
                            dialog.cancelText : 'Cancel'
                    }}</Button>
                    <Button @click="handleConfirm" size="md" class="relative">{{ dialog.confirmText ?
                        dialog.confirmText : 'Confirm' }}
                        <PawPrint class="absolute -top-0.75 -right-0.5" fill="var(--color-bg-rgba)"
                            color="var(--color-brand-light)" :size="28" stroke-width="1.5" />
                    </Button>
                </div>
            </div>
        </Transition>
    </dialog>
</template>

<style scoped>
dialog:focus-visible {
    outline: none;
}

h2 {
    font-family: var(--font-main);
    color: var(--color-brand);
    font-weight: 500;
}

.modal-pop-enter-active,
.modal-pop-leave-active {
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-pop-enter-from,
.modal-pop-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(12px);
}

.modal-pop-enter-to,
.modal-pop-leave-from {
    opacity: 1;
    transform: scale(1) translateY(0);
}
</style>