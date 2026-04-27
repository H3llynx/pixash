<script setup lang="ts">
import { CheckCircle, PenLine } from '@lucide/vue';
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { usePets } from '../../pets/composables/usePets';
import type { VetExtended } from '../types';

const { updateSelectedVet } = usePets();
const { t } = useI18n();

const props = defineProps<{ vet: VetExtended }>();

const isUpdatingNotes = ref<boolean>(false);
const notesData = ref<string>(props.vet.notes ?? "");
const notesRef = ref<HTMLTextAreaElement>();
const toggleRef = ref<HTMLButtonElement>();

onClickOutside(notesRef, () => {
    if (isUpdatingNotes.value) isUpdatingNotes.value = false;
}, { ignore: [toggleRef] });

const toggleNoteEdit = () => {
    isUpdatingNotes.value = !isUpdatingNotes.value;
    if (isUpdatingNotes.value) {
        notesRef.value?.focus();
        notesRef.value?.setSelectionRange(notesData.value.length, notesData.value.length);

    }
};

const handleNoteEdit = async () => {
    if (notesData.value === props.vet.notes) return;
    await updateSelectedVet(props.vet, { notes: notesData.value });
}
</script>


<template>
    <Button variant="vetOptions" size="xs" @click="toggleNoteEdit"
        :aria-label="isUpdatingNotes ? t('vet.cta.saveNotes') : t('vet.cta.notes')" ref="toggleRef">
        <CheckCircle v-if="isUpdatingNotes" />
        <PenLine v-else />
    </Button>
    <textarea v-model="notesData" :readonly="!isUpdatingNotes" ref="notesRef" :placeholder="t('vet.notesPlaceholder')"
        :class="{ 'italic py-0.5 px-1 border-0': true, 'text-text-secondary': !isUpdatingNotes }"
        @change="handleNoteEdit" />
</template>