<script setup lang="ts">
import { ref, watch } from 'vue';

const dialogRef = ref<HTMLDialogElement>();
const visible = defineModel<boolean>();

const openDialog = async () => {
    dialogRef.value?.showModal();
};
const closeDialog = () => {
    dialogRef.value?.close();
};

watch(visible, (visible) => visible ? openDialog() : closeDialog());
</script>

<template>
    <dialog ref="dialogRef" @click.self="closeDialog" @close="visible = false"
        class="m-auto bg-transparent text-text w-[80%] max-w-sm backdrop:bg-black/40 backdrop:filter-blur overflow-hidden">
        <slot />
    </dialog>
</template>