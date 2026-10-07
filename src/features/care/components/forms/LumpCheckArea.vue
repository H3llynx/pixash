<script setup lang="ts">
import { ImageIcon, X } from '@lucide/vue';
import { watch } from 'vue';
import VueEasyLightbox, { useEasyLightbox } from 'vue-easy-lightbox';
import { useI18n } from 'vue-i18n';
import AddPictures from '../../../../components/AddPictures.vue';
import Button from '../../../../components/Button.vue';
import Input from '../../../../components/Input.vue';
import Selector from '../../../../components/Selector.vue';
import Textarea from '../../../../components/Textarea.vue';
import { useAddPictures, type Picture } from '../../../../composables/useAddPictures.ts';
import { useLumpCheck } from '../../composables/useLumpCheck.ts';
import { lumpFields } from '../../config.ts';

const { t } = useI18n();
const { setUnit, defaultCheck } = useLumpCheck();
const { size, status, notes } = lumpFields;

const checkData = defineModel<typeof defaultCheck>({ required: true });
const pictures = defineModel<Picture[]>("pictures", { required: true });

defineProps<{ loadedPictures: Set<string> }>();

const { deleteFormPicture } = useAddPictures(pictures);

const { show: showLightbox, onHide, visibleRef, indexRef, imgsRef } = useEasyLightbox({
    imgs: checkData.value?.pictures ?? [],
    initIndex: 0
});

watch(() => checkData.value?.pictures ?? [], (pictures) => {
    imgsRef.value = pictures;
});
</script>

<template>
    <div>
        <div class="default-padding flex flex-col gap-1">
            <div class="flex gap-0.5 items-end">
                <Input v-model="checkData.size.value" :type="size.type" :id="size.id" :label="t(size.label)"
                    step="0.1" />
                <div class="input-container w-max">
                    <select :value="checkData.size.displayUnit" class="p-0.5 w-3"
                        @change="setUnit(checkData, ($event.target as HTMLSelectElement).value as 'cm' | 'mm')">
                        <option>cm</option>
                        <option>mm</option>
                    </select>
                </div>
            </div>
            <h3 class="text-sm uppercase text-text-secondary font-medium tracking-wide">{{
                t("health.sharedFields.photos") }}</h3>
            <div class="preview-container">
                <div v-for="(picture, index) in checkData.pictures" :key="picture"
                    class="relative rounded-lg mb-0.25 min-w-[140px] cursor-pointer">
                    <div v-if="!loadedPictures.has(picture)"
                        class="rounded-lg min-w-[160px] h-[120px] bg-border-light flex items-center justify-center">
                        <ImageIcon :size="28" class="opacity-30 animate-pulse" />
                    </div>
                    <img :src="picture" @load="loadedPictures.add(picture)" class="rounded-lg relative"
                        @click="showLightbox(index)" :class="{ 'hidden': !loadedPictures.has(picture) }" />
                    <Button type="button" variant="ghost" size="xxs" :aria-label="t('common.button.delete')"
                        @click.stop="deleteFormPicture(checkData, picture)" class="delete-btn hover:bg-error">
                        <X :size="20" />
                    </Button>
                </div>
                <AddPictures v-model="pictures" :initialImages="checkData.pictures.length" :max="10" />
            </div>
            <VueEasyLightbox :visible="visibleRef" :imgs="imgsRef" :index="indexRef" :loop="true" @hide="onHide" />
            <label :for="notes.id">
                <p>{{ t(notes.label) }}</p>
                <Textarea v-model="checkData.notes" :id="notes.id" :placeholder="t(notes.placeholder)"
                    :maxLength="500" />
            </label>
        </div>
        <Selector :legend="t(status.label)" class="mt-1 status">
            <div v-for="option in status.options" :key="option.id" :style="{
                '--bg-color': option.rgba,
                '--text-color': option.rgb
            }">
                <Input v-model="checkData.status" :name="status.name" :id="option.id" :value="option.id"
                    :label="t(option.label)" :type="status.type" />
            </div>
        </Selector>
    </div>
</template>

<style scoped>
:deep(.status label:has(input[type='radio']:checked) p) {
    background: var(--bg-color);
    color: var(--text-color);
    border-color: var(--color-border-light);
}
</style>