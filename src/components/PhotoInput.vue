<script setup lang="ts">
import { Camera } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import { usePictureUpdate } from '../composables/usePictureUpdate';

const { onFileChange } = usePictureUpdate();
const { t } = useI18n();

</script>

<template>
    <label for="profile-picture" :aria-label="t('common.fileInputLabel')">
        <input id="profile-picture" type="file" accept="image/*" class="sr-only" ref="fileInputRef" tabindex="0"
            @change="onFileChange" @click="(e) => (e.target as HTMLInputElement).value = ''" />
        <Camera />
    </label>
</template>

<style scoped>
label {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 2rem;
    border-radius: 0.75rem;
    background: var(--background-image-card);
    border: 1px solid var(--color-brand);

    &:has(:focus-visible) {
        outline-width: 2px;
        outline-style: solid;
        outline-offset: 1px;
        outline-color: var(--color-gold);
    }

    &:hover {
        background: var(--color-brand-light);
    }
}
</style>