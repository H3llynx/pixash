<script setup lang="ts">
import { Camera, X } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import { useAddPictures } from '../composables/useAddPictures.ts';
import Button from './Button.vue';

const { t } = useI18n();
const { pictures, onFileChange, deletePicture } = useAddPictures();
</script>

<template>
    <div v-if="pictures.length" class="relative rounded-lg mb-0.25 min-w-[160px] max-w-1/2" v-for="picture in pictures"
        :key="picture.preview">
        <img :src="picture.preview" alt="image preview" class="rounded-lg" />
        <Button type="button" variant="ghost" size="xxs" :aria-label="t('health.cta.cancelLog')"
            @click="deletePicture(picture)" class="delete-btn hover:bg-error absolute">
            <X :size="20" />
        </Button>
    </div>
    <label for="pictures" :aria-label="t('common.fileInputLabel')"
        class="min-w-[160px] max-h-[160px] mb-0.25 border border-dashed border-text-secondary text-text-secondary rounded-xl flex items-center gap-[5px] justify-center disabled:opacity-40 disabled:cursor-not-allowed p-0.5 hover:text-brand-light hover:border-brand-light">
        <input id="pictures" type="file" accept="image/*" class="sr-only" tabindex="0" multiple @change="onFileChange"
            @click="(e) => (e.target as HTMLInputElement).value = ''" :disabled="pictures.length >= 10" />
        <Camera class="shrink-0" />
    </label>
</template>