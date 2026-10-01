<script setup lang="ts">
import { ImageIcon, X } from '@lucide/vue';
import { provide, watch } from 'vue';
import VueEasyLightbox, { useEasyLightbox } from 'vue-easy-lightbox';
import { useI18n } from 'vue-i18n';
import AddPictures from '../../../../components/AddPictures.vue';
import Button from '../../../../components/Button.vue';
import Input from '../../../../components/Input.vue';
import LoadingPet from '../../../../components/loading/LoadingPet.vue';
import Panel from '../../../../components/Panel.vue';
import Selector from '../../../../components/Selector.vue';
import Textarea from '../../../../components/Textarea.vue';
import { useAddPictures } from '../../../../composables/useAddPictures.ts';
import { useFormMode } from '../../../../composables/useFormMode.ts';
import PetIcon from '../../../pets/components/PetIcon.vue';
import PetSelector from '../../../pets/components/PetSelector.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import { lumpFields } from '../../config.ts';
import BodyMap from '../lumps/BodyMap.vue';
import CheckCard from '../lumps/CheckCard.vue';
import ButtonArea from './ButtonArea.vue';
import { useLumpForm } from './composables/useLumpForm.ts';

const { selectedPet, isAddingCare, selectedLump } = usePets();
const { lumpData, checkData, reset, fillLumpData, setUnit, loading, pictures, loadedPictures, handleClose, handleDelete, handleSubmit } = useLumpForm();
const { deleteFormPicture } = useAddPictures(pictures);
const { t } = useI18n();
const { mode, isReadonly } = useFormMode();
provide('readonly', isReadonly);

const { title, location, size, status, notes } = lumpFields;

const { show: showLightbox, onHide, visibleRef, indexRef, imgsRef } = useEasyLightbox({
    imgs: checkData.pictures,
    initIndex: 0
});

watch(() => isAddingCare.lump, (adding) => {
    if (adding) mode.value = "edit";
    reset();
});

watch(() => selectedLump.value, (lump) => {
    mode.value = lump ? "view" : "edit";
    loadedPictures.clear();
    if (lump) fillLumpData(lump);
    else reset();
}, { deep: true });

watch(() => checkData.pictures, (pictures) => {
    imgsRef.value = pictures;
});
</script>

<template>
    <Transition name="panel">
        <Panel v-if="isAddingCare.lump || selectedLump" :onClose="handleClose">
            <LoadingPet v-if="loading" />
            <div class="md:max-w-max" v-else>
                <div class="flex gap-1 justify-between my-1 default-padding">
                    <div v-if="selectedLump && selectedPet"
                        class="rounded-full w-3 h-3 text-3xl flex shrink-0 justify-center items-center">
                        <PetIcon :pet="selectedPet" />
                    </div>
                    <h1 v-if="mode === 'edit'">{{ t("health.lumpForm.heading") }}</h1>
                    <template v-else>
                        <h1 class="font-medium">{{ selectedPet!.name }} · {{ selectedLump!.title
                            }}
                        </h1>
                    </template>
                    <Button v-if="selectedLump" action="delete" :aria-label="t('common.button.delete')"
                        @click="handleDelete" />
                </div>
                <PetSelector v-if="isAddingCare.lump" stacked />
                <form @submit.prevent="handleSubmit">
                    <div v-if="mode === 'edit'" class="default-padding flex flex-col gap-1">
                        <Input v-model="lumpData.title" :id="title.id" :label="t(title.label)" required />
                    </div>
                    <Selector v-if="mode === 'edit'" :legend="t(location.label)" class="location mt-1 mb-0.5">
                        <div class="flex w-max bg-bg-rgba p-0.25 rounded-xl">
                            <Input v-model="lumpData.location.side" v-for="option in location.options"
                                :name="location.name" :id="option.id" :value="option.id" :key="option.id"
                                :label="t(option.label)" :type="location.type" />
                        </div>
                    </Selector>
                    <BodyMap v-model="lumpData.location" />
                    <template v-if="isAddingCare.lump">
                        <div class="default-padding flex flex-col gap-1">
                            <div class="flex gap-0.5 items-end">
                                <Input v-model="checkData.size.value" :type="size.type" :id="size.id"
                                    :label="t(size.label)" step="0.1" required />
                                <div class="input-container w-max">
                                    <select :value="checkData.size.displayUnit" class="p-0.5 w-3"
                                        @change="setUnit(($event.target as HTMLSelectElement).value as 'cm' | 'mm')"
                                        :class="mode === 'view' && 'select-read-only'"
                                        @keydown.space.enter.up.down.prevent="mode === 'view' && $event.preventDefault()"
                                        required>
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
                                        @click="showLightbox(index)"
                                        :class="{ 'hidden': !loadedPictures.has(picture) }" />
                                    <Button type="button" variant="ghost" size="xxs"
                                        :aria-label="t('common.button.delete')"
                                        @click.stop="deleteFormPicture(checkData, picture)"
                                        class="delete-btn hover:bg-error">
                                        <X :size="20" />
                                    </Button>
                                </div>
                                <AddPictures v-model="pictures" :initialImages="checkData.pictures.length" :max="10" />
                            </div>
                            <VueEasyLightbox :visible="visibleRef" :imgs="imgsRef" :index="indexRef" :loop="true"
                                @hide="onHide" />
                            <label :for="notes.id" v-if="mode === 'edit'">
                                <p>{{ t(notes.label) }}</p>
                                <Textarea v-model="checkData.notes" :id="notes.id" :placeholder="t(notes.placeholder)"
                                    :maxLength="500" />
                            </label>
                        </div>
                        <Selector v-if="mode === 'edit'" :legend="t(status.label)" class="mt-1 status">
                            <div v-for="option in isReadonly ? status.options.filter(o => o.id === checkData.status) : status.options"
                                :key="option.id" :style="{
                                    '--bg-color': option.rgba,
                                    '--text-color': option.rgb
                                }">
                                <Input v-model="checkData.status" :name="status.name" :id="option.id" :value="option.id"
                                    :label="t(option.label)" :type="status.type" />
                            </div>
                        </Selector>
                    </template>
                    <div v-else-if="selectedLump && mode === 'view'" class="pet-selector">
                        <CheckCard v-for="check in selectedLump.checks" :check="check" />
                    </div>
                    <div class="default-padding">
                        <ButtonArea v-model="mode" :loading="loading" :selectedCare="selectedLump"
                            :customCta="t('health.cta.saveLump')" />
                    </div>
                </form>
            </div>
        </Panel>
    </Transition>
</template>

<style scoped>
:deep(.location label p) {
    margin: 0;
    border-radius: 0.75rem;
}

:deep(.location label:has(input[type='radio']:not(:checked)) p) {
    background: transparent;
    border: none;
}

:deep(.status label:has(input[type='radio']:checked) p) {
    background: var(--bg-color);
    color: var(--text-color);
}

.select-read-only {
    border: none;
    color: var(--color-text-softer)
}
</style>