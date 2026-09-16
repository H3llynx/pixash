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

const { updateSelectedPet, deleteSelectedPetField, selectedPet } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();
const { chipData } = usePetDetails();
const { copyToClipboard, clipboardText } = useClipboard();

const editing = ref<boolean>(false);
const updateRef = ref<HTMLFormElement>();
const loading = ref<boolean>(false);

onClickOutside(updateRef, () => {
    if (editing.value) editing.value = false;
});

const { activate, deactivate } = useFocusTrap(updateRef, {
    immediate: true,
    allowOutsideClick: true,
    escapeDeactivates: false,
});

const startUpdating = () => {
    if (!selectedPet.value) return;
    chipData.value = selectedPet.value.microchip || "";
    editing.value = true;
};

const handleSubmit = async () => {
    if (!selectedPet.value || !chipData.value || chipData.value === selectedPet.value.microchip) return;
    loading.value = true;
    await updateSelectedPet(selectedPet.value, { microchipped: true, microchip: chipData.value });
    editing.value = false;
    loading.value = false;
};

const handleDelete = async () => {
    if (!selectedPet.value) return;
    await deleteSelectedPetField(selectedPet.value, "microchip");
    await updateSelectedPet(selectedPet.value, { microchipped: false });
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
    <div class="flex gap-0.5 items-center text-sm">
        <template v-if="selectedPet?.microchip">
            <div class="rounded-xl w-2 h-2 bg-border-light flex shrink-0 justify-center items-center">
                <Cpu color="var(--color-text-secondary)" />
            </div>
            <div v-if="!editing" class="flex items-center gap-0.5">
                <span v-if="isMd" class="text-text-secondary">{{ t("pet.profile.labels.microchip") }}</span>
                <span class="font-medium font-mono h-2 flex items-center">
                    {{ selectedPet.microchip }}</span>
                <Button variant="ghost" size="xxs" :aria-label="t('pet.profile.edit.microchip')" @click="startUpdating">
                    <Edit2 :size="15" />
                </Button>
                <Button :variant="clipboardText ? 'ghost' : 'primary'" :size="clipboardText ? 'xxs' : 'rounded'"
                    :aria-label="t('pet.profile.edit.microchip')" @click="copyToClipboard(selectedPet.microchip)"
                    :disabled="clipboardText">
                    <span v-if="clipboardText">{{ clipboardText }}</span>
                    <Copy v-else :size="15" />
                </Button>
            </div>
        </template>
        <Button v-else-if="!selectedPet?.microchip && !editing" variant="add" @click="startUpdating" class="w-full">
            <Plus />{{ t("pet.profile.addChip", { name: selectedPet?.name }) }}
        </Button>
        <form ref="updateRef" v-if="editing" @submit.prevent="handleSubmit()" class="mini-form flex gap-0.5 font-mono">
            <Input v-model="chipData" :id="`pet-microchip`" />
            <Button v-if="chipData.length && chipData !== selectedPet?.microchip" size="xxs"
                :aria-label="t('common.button.save')">
                <Forward :size="15" class="rotate-180" />
            </Button>
            <Button v-else type="button" size="xs" variant="ghost" @click="editing = false"
                :aria-label="t('common.button.cancel')">
                <X :size="16" />
            </Button>
            <Button v-if="editing" type="button" size="xs" variant="ghost" @click="handleDelete"
                :aria-label="t('pet.profile.deleteChip', { name: selectedPet?.name })">
                <Trash2 :size="16" />
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