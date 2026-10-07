<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { computed, provide, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Input from '../../../../components/Input.vue';
import LoadingPet from '../../../../components/loading/LoadingPet.vue';
import Panel from '../../../../components/Panel.vue';
import Selector from '../../../../components/Selector.vue';
import { useFormMode } from '../../../../composables/useFormMode.ts';
import PetIcon from '../../../pets/components/PetIcon.vue';
import PetSelector from '../../../pets/components/PetSelector.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import { useLumpCheck } from '../../composables/useLumpCheck.ts';
import { lumpFields } from '../../config.ts';
import BodyMap from '../lumps/BodyMap.vue';
import CheckCard from '../lumps/CheckCard.vue';
import ButtonArea from './ButtonArea.vue';
import { useLumpForm } from './composables/useLumpForm.ts';
import LumpCheckArea from './LumpCheckArea.vue';

const { selectedPet, isAddingCare, selectedLump } = usePets();
const { lumpData, checkData, reset, fillLumpData, loading, pictures, loadedPictures, handleClose, handleDelete, handleSubmit } = useLumpForm();
const { openModal } = useLumpCheck();
const { t } = useI18n();
const { mode, isReadonly } = useFormMode();
provide('readonly', isReadonly);

const { lumpChecks } = useLumpCheck();
const { title, location } = lumpFields;

const checks = computed(() => [...lumpChecks.value]
    .filter(check => check.lumpId === selectedLump.value?.id)
    .sort((a, b) => b.date.toMillis() - a.date.toMillis())
);

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
                    <LumpCheckArea v-if="isAddingCare.lump" v-model="checkData" v-model:pictures="pictures"
                        :loadedPictures="loadedPictures" />
                    <div v-else-if="selectedLump && mode === 'view'" class="pet-selector">
                        <Button variant="add" class="w-13" @click="openModal(selectedLump, 'edit')">
                            <Plus /> {{ t("common.button.add") }}
                        </Button>
                        <CheckCard v-for="check in checks" :check="check" />
                    </div>
                    <div class="default-padding mt-1">
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
</style>