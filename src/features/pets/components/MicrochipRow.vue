<script setup lang="ts">
import { Copy, Cpu, Edit2, Forward, Plus, Trash2, X } from '@lucide/vue';
import { onClickOutside } from '@vueuse/core';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap.js';
import { nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import Input from '../../../components/Input.vue';
import { useClipboard } from '../../../composables/useClipboard';
import { useMedia } from '../../../composables/useMedia';
import { usePetDetails } from '../composables/usePetDetails';
import { usePets } from '../composables/usePets';
import type { PetExtended } from '../types';

const { updateSelectedPet, deleteSelectedPetField } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();
const props = defineProps<{ pet: PetExtended }>();
const editing = ref<boolean>(false);
const updateRef = ref<HTMLFormElement>();
const { chipData, loading } = usePetDetails(props.pet);
const { copyToClipboard, clipboardText } = useClipboard();

onClickOutside(updateRef, () => {
    if (editing.value) editing.value = false;
});

const { activate, deactivate } = useFocusTrap(updateRef, {
    immediate: true,
    allowOutsideClick: true,
    escapeDeactivates: false,
});

const startUpdating = () => {
    chipData.value = props.pet.microchip || "";
    editing.value = true;
};

const handleSubmit = async () => {
    if (!chipData.value) return;
    loading.value = true;
    await updateSelectedPet(props.pet, { microchipped: true, microchip: chipData.value });
    editing.value = false;
    loading.value = false;
};

const handleDelete = async () => {
    await deleteSelectedPetField(props.pet, "microchip");
    await updateSelectedPet(props.pet, { microchipped: false });
    editing.value = false;
};

watch(() => editing.value, async (editing) => {
    if (editing) {
        await nextTick();
        activate();
    } else deactivate();
});
</script>

<template>
    <div class="flex gap-0.5 items-center text-sm mt-0.5">
        <template v-if="pet.microchip">
            <div class="rounded-xl w-2 h-2 bg-separator flex shrink-0 justify-center items-center">
                <Cpu color="var(--color-text-secondary)" />
            </div>
            <div v-if="!editing" class="flex items-center gap-0.5">
                <span v-if="isMd" class="text-text-secondary">{{ t("pet.profile.labels.microchip") }}</span>
                <span v-if="pet.microchip" class="font-medium font-mono h-2 flex items-center">
                    {{ pet.microchip }}</span>
                <Button variant="ghost" size="xxs" :aria-label="t('pet.profile.edit.microchip')" @click="startUpdating">
                    <Edit2 v-if="pet.microchip" :size="15" />
                </Button>
                <Button size="xxs" :aria-label="t('pet.profile.edit.microchip')" @click="copyToClipboard(pet.microchip)"
                    class="p-[6px]">
                    <Copy v-if="pet.microchip && !clipboardText" :size="15" />
                    <span v-if="clipboardText">{{ clipboardText }}</span>
                </Button>
            </div>
        </template>
        <Button v-else-if="!pet.microchip && !editing" variant="add" @click="startUpdating" class="w-full">
            <Plus />{{ t("pet.profile.addChip", { name: pet.name }) }}
        </Button>
        <form ref="updateRef" v-if="editing" @submit.prevent="handleSubmit()" class="mini-form flex gap-0.5 font-mono">
            <Input v-model="chipData" :id="`pet-microchip`" />
            <Button v-if="chipData.length && chipData !== pet.microchip" size="xxs"
                :aria-label="t('common.button.save')">
                <Forward :size="15" class="rotate-180" />
            </Button>
            <Button v-else type="button" size="xxs" variant="ghost" @click="editing = false"
                :aria-label="t('common.button.cancel')">
                <X :size="16" color="var(--color-brand-light)" />
            </Button>
            <Button v-if="editing" type="button" size="xxs" variant="ghost" @click="handleDelete">
                <Trash2 :size="16" color="var(--color-brand-light)" />
            </Button>
        </form>
    </div>
</template>

<style scoped>
:deep(input) {
    padding-block: 4px;
    padding-inline: 10px;
    min-width: 8rem;
}
</style>