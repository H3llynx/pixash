<script setup lang="ts">
import { CalendarCheck, Trash2 } from '@lucide/vue';
import { computed, provide, ref, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Input from '../../../../components/Input.vue';
import LoadingPuppy from '../../../../components/loading/LoadingPuppy.vue';
import Panel from '../../../../components/Panel.vue';
import { useFormMode } from '../../../../composables/useFormMode';
import { tsToDate } from '../../../../utils';
import PetSelector from '../../../pets/components/PetSelector.vue';
import { usePets } from '../../../pets/composables/usePets';
import { getIcon } from '../../../pets/utils';
import { useEvents } from '../../composables/useEvents';
import { useTreatmentForm } from '../../composables/useTreatmentForm';
import { treatmentFields } from '../../config';
import type { TreatmentExtended } from '../../types';
import { resetForm } from '../../utils';
import MedicineArea from './MedicineArea.vue';
import VetSelector from './VetSelector.vue';

const { loading, selectedPet, selectedTreatment, isAddingHealth, healthLoading, selectedVet, vets } = usePets();
const { handleClose, formData, defaultForm, handleSubmit, handleDelete, addMedicine } = useTreatmentForm();
const { selectedDate } = useEvents();
const { t } = useI18n();
const { mode, isReadonly } = useFormMode();
const { name, startDate, vet, notes } = treatmentFields;
provide('readonly', isReadonly);

console.log('TreatmentForm script evaluated');

watchEffect(() => {
    console.log('TreatmentForm reactive state:', {
        isAdding: isAddingHealth.treatment,
        selected: !!selectedTreatment.value,
        pet: !!selectedPet.value
    });
});

const vetTextInput = ref<boolean>(false);
const assignedVet = computed(() => {
    if (selectedVet.value) return selectedVet.value.id;
    const pet = selectedPet.value;
    if (pet) {
        const vetForPet = vets.value?.find(v => v.assignedPets?.includes(pet.id));
        if (vetForPet) return vetForPet.id;
    }
    return vets.value?.[0]?.id ?? "";
});
const dateInit = computed(() => {
    return selectedDate.value ? selectedDate.value : new Date().toISOString().slice(0, 10);
});

const fillTreatmentData = (treatment: Partial<TreatmentExtended>) => {
    const isRegisteredVet = vets.value?.some(vet => vet.id === treatment.vet);
    vetTextInput.value = !isRegisteredVet;
    Object.assign(formData, {
        name: treatment.name,
        startDate: tsToDate(treatment.startDate, "input"),
        vet: treatment.vet,
        notes: treatment.notes ?? "",
        medication: treatment.medication?.map(med => ({
            ...med,
            endDate: med.endDate ? tsToDate(med.endDate, "input") : "",
        }))
    })
};

watch(() => isAddingHealth.treatment, (adding) => {
    if (adding) {
        mode.value = "edit";
        formData.vet = assignedVet.value;
        formData.startDate = dateInit.value;
        formData.medication = [addMedicine()];
    }
});

watch(() => [selectedPet.value, selectedTreatment.value] as const,
    ([pet, treatment]) => {
        if (!pet) {
            resetForm(formData, defaultForm);
            return;
        };
        if (treatment) {
            mode.value = "view";
            fillTreatmentData(treatment);
        }
    },
    { immediate: true }
);

watch(() => mode.value, (mode) => {
    if (mode === "view") fillTreatmentData(selectedTreatment.value!);
});
</script>

<template>
    <Transition name="panel" appear>
        <Panel v-if="isAddingHealth.treatment || selectedTreatment" :onClose="handleClose">
            <LoadingPuppy v-if="loading || healthLoading" />
            <div v-else class="md:max-w-max">
                <div class="flex gap-1 justify-between my-1 default-padding items-center">
                    <div v-if="selectedTreatment && selectedPet"
                        class="rounded-full w-3 h-3 bg-brand-rgba text-3xl flex shrink-0 justify-center items-center">
                        {{ getIcon(selectedPet) }}
                    </div>
                    <h1 v-if="isAddingHealth.treatment">{{ t("health.title.addTreatment") }}</h1>
                    <h1 v-else-if="selectedTreatment && mode === 'edit'">{{ t("health.title.editTreatment", {
                        name: selectedPet!.name
                    }) }}</h1>
                    <h1 v-else-if="selectedTreatment && mode === 'view'">{{ selectedTreatment.name }}</h1>
                    <Button v-if="selectedTreatment" class="ml-auto mb-auto" variant="ghost" size="xs"
                        :aria-label="t('health.cta.deleteVisit')" @click="handleDelete">
                        <Trash2 :size="22" color="var(--color-brand-light)" />
                    </Button>
                </div>
                <PetSelector v-if="isAddingHealth.treatment" form />
                <form @submit.prevent="handleSubmit" class="mt-1">
                    <div class="default-padding flex flex-col gap-1">
                        <Input v-model="formData.name" :id="name.id" :label="t(name.label)" required />
                        <Input v-model="formData.startDate" :id="startDate.id" :label="t(startDate.label)"
                            :type="startDate.type" :class="mode === 'view'" required>
                            <template #addon>
                                <CalendarCheck class=" mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <VetSelector :vet="vet" v-model="formData.vet" v-model:vetTextInput="vetTextInput" required />
                        <Input v-if="selectedTreatment?.notes || mode === 'edit'" v-model="formData.notes"
                            :id="notes.id" :label="t(notes.label)" :type="notes.type" />
                        <MedicineArea v-model="formData.medication" />
                        <div class="flex gap-0.5 mt-1 items-center ml-auto"
                            v-if="!selectedTreatment || mode === 'edit'">
                            <Button v-if="selectedTreatment && mode === 'edit'" variant="secondary" size="sm"
                                type="button" :disabled="healthLoading" @click="mode = 'view'">
                                {{ t("common.button.cancel") }}
                            </Button>
                            <Button size="sm" :disabled="healthLoading">{{ isAddingHealth.treatment ?
                                t("health.cta.startTreatment") :
                                t("health.cta.saveTreatment") }}</Button>
                        </div>
                        <Button v-if="selectedTreatment && mode === 'view'" size="sm" class="mt-1 md:ml-auto"
                            @click="mode = 'edit'">
                            {{ t("health.cta.editTreatment") }}
                        </Button>
                    </div>
                </form>
            </div>
        </Panel>
    </Transition>
</template>