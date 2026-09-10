<script setup lang="ts">
import { ref, Transition, watch } from 'vue';

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
    <dialog ref="dialogRef" @click.self="closeDialog" @close="visible = false" class="dialog-overlay w-[80%] max-w-sm">
        <transition name="toast">
            <div v-if="visible" class="dialog-box">
                <slot />
            </div>
        </Transition>
    </dialog>
</template>