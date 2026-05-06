<script setup lang="ts">
import { PawPrint, TriangleAlert } from '@lucide/vue';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDialog } from '../composables/useDialog';
import Button from './Button.vue';

const dialogRef = ref<HTMLDialogElement>();
const { dialog } = useDialog();
const { t } = useI18n();

const openDialog = async () => dialogRef.value?.showModal();
const closeDialog = () => {
    dialog.value = null;
    dialogRef.value?.close();
};

const handleConfirm = () => {
    if (!dialog.value?.onConfirm) return;
    dialog.value.onConfirm();
    closeDialog();
};

watch(dialog, (newVal) => {
    if (newVal) openDialog();
    else if (dialogRef.value?.open) closeDialog();
}, { immediate: true })
</script>

<template>
    <dialog ref="dialogRef"
        class="m-auto bg-transparent text-text max-w-xs md:max-w-sm backdrop:bg-black/40 backdrop:filter-blur"
        :aria-labelledby="dialog?.title" @click.self="closeDialog">
        <Transition name="modal-pop" appear>
            <div v-if="dialog" class="dialog-box text-center items-center">
                <div class="rounded-full w-4 h-4 bg-brand-rgba text-4xl flex shrink-0 justify-center items-center">
                    <TriangleAlert v-if="dialog.isDelete" :size="30" />
                    <PawPrint v-else :size="30" />
                </div>
                <h2>{{ dialog.title }}</h2>
                <p>{{ dialog.message }}</p>
                <div class="flex justify-center gap-0.5 mt-0.5">
                    <Button @click="closeDialog" variant="secondary">{{
                        dialog.cancelText ?
                            dialog.cancelText : t("common.button.cancel")
                    }}</Button>
                    <Button @click="handleConfirm" size="md" class="relative">{{ dialog.confirmText ?
                        dialog.confirmText : t("common.button.confirm") }}
                        <PawPrint class="absolute -top-0.75 -right-0.5" fill="var(--color-bg-rgba)"
                            color="var(--color-brand-light)" :size="28" stroke-width="1.5" />
                    </Button>
                </div>
            </div>
        </Transition>
    </dialog>
</template>

<style scoped>
h2 {
    font-family: var(--font-main);
    color: var(--color-brand);
    font-weight: 500;
}
</style>