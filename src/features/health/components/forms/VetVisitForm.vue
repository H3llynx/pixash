<script setup lang="ts">
import { CalendarCheck, Trash2 } from '@lucide/vue';
import { computed, provide, ref, Transition, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Paw from '../../../../components/icons/Paw.vue';
import Input from '../../../../components/Input.vue';
import LoadingPuppy from '../../../../components/loading/LoadingPuppy.vue';
import Panel from '../../../../components/Panel.vue';
import { useFormMode } from '../../../../composables/useFormMode';
import { tsToDate } from '../../../../utils';
import PetSelector from '../../../pets/components/PetSelector.vue';
import { usePets } from '../../../pets/composables/usePets';
import { getIcon } from '../../../pets/utils';
import { useEvents } from '../../composables/useEvents';
import { useVetVisitForm } from '../../composables/useVetVisitForm';
import { vetVisitFields } from '../../config';
import type { VisitExtended } from '../../types';
import { resetForm } from '../../utils';
import VetFormSelector from './VetFormSelector.vue';

const { loading, selectedPet, selectedVisit, isAddingHealth, healthLoading, selectedVet, vets } = usePets();
const { mode, isReadonly } = useFormMode();
const { selectedDate } = useEvents();
const { t } = useI18n();
const { formData, defaultForm, handleClose, handleSubmit, handleDelete } = useVetVisitForm();
const { title, date, vet, notes } = vetVisitFields;
provide('readonly', isReadonly);

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
const visitDate = computed(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return selectedDate.value ? `${selectedDate.value}T${h}:${min}` : ""
});

const fillVisitData = (visit: Partial<VisitExtended>) => {
    const isRegisteredVet = vets.value?.some(vet => vet.id === visit.vet);
    vetTextInput.value = !isRegisteredVet;
    Object.assign(formData, {
        title: visit.title,
        date: tsToDate(visit.date, "datetime"),
        vet: visit.vet,
        notes: visit.notes ?? "",
    })
};

watch(() => isAddingHealth.visit, (adding) => {
    if (adding) {
        mode.value = "edit";
        formData.vet = assignedVet.value;
        formData.date = visitDate.value;
    }
});

watch(() => [selectedPet.value, selectedVisit.value] as const,
    ([pet, visit]) => {
        if (!pet) {
            resetForm(formData, defaultForm);
            return;
        };
        if (visit) {
            mode.value = "view";
            fillVisitData(visit);
        }
        else {
            resetForm(formData, defaultForm, { exclude: ['title'] });
            formData.vet = assignedVet.value;
            formData.date = visitDate.value;
        };
    },
    { immediate: true }
);

watch(() => mode.value, (mode) => {
    if (mode === "view") fillVisitData(selectedVisit.value!);
})
</script>

<template>
    <Transition name="panel" appear>
        <Panel v-if="isAddingHealth.visit || selectedVisit" :onClose="handleClose">
            <LoadingPuppy v-if="loading || healthLoading" />
            <div v-else class="md:max-w-max">
                <div class="flex gap-1 justify-between my-1 default-padding items-center">
                    <div v-if="selectedVisit && selectedPet"
                        class="rounded-full w-3 h-3 bg-brand-rgba text-3xl flex shrink-0 justify-center items-center">
                        {{ getIcon(selectedPet) }}
                    </div>
                    <h1 v-if="isAddingHealth.visit">{{ t("health.title.addVetVisit") }}</h1>
                    <h1 v-else-if="selectedVisit && mode === 'edit'">{{ t("health.title.editVetVisit", {
                        name: selectedPet!.name
                    }) }}</h1>
                    <h1 v-else-if="selectedVisit && mode === 'view'">{{ selectedVisit.title }}</h1>
                    <Button v-if="selectedVisit" class="ml-auto mb-auto" variant="ghost" size="xs"
                        :aria-label="t('health.cta.deleteVisit')" @click="handleDelete">
                        <Trash2 :size="22" color="var(--color-brand-light)" />
                    </Button>
                </div>
                <PetSelector v-if="isAddingHealth.visit" form />
                <form @submit.prevent="handleSubmit" class="mt-1">
                    <div class="default-padding flex flex-col gap-1">
                        <Input v-if="mode === 'edit'" v-model="formData.title" :id="title.id" :label="t(title.label)"
                            required />
                        <Input v-model="formData.date" :id="date.id" :label="t(date.label)" :type="date.type"
                            :class="mode === 'view'" required>
                            <template #addon>
                                <CalendarCheck class=" mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <VetFormSelector :vet="vet" v-model="formData.vet" v-model:vetTextInput="vetTextInput"
                            required />
                        <label :for="notes.id" v-if="selectedVisit?.notes || mode === 'edit'">
                            <p>{{ t(notes.label) }}</p>
                            <textarea v-model="formData.notes" :id="notes.id"
                                :readonly="!!selectedVisit && mode === 'view'" />
                        </label>
                        <div class="flex gap-0.5 mt-1 items-center ml-auto" v-if="!selectedVisit || mode === 'edit'">
                            <Button v-if="selectedVisit && mode === 'edit'" variant="secondary" size="sm" type="button"
                                :disabled="healthLoading" @click="mode = 'view'">
                                {{ t("common.button.cancel") }}
                            </Button>
                            <Button size="sm" :disabled="healthLoading">{{ t("health.cta.saveVisit")
                            }}
                                <Paw class="w-1 -rotate-12" />
                            </Button>
                        </div>
                        <Button v-if="selectedVisit && mode === 'view'" size="sm" class="mt-1 md:ml-auto"
                            @click="mode = 'edit'">
                            {{ t("health.cta.editVetVisit") }}
                        </Button>
                    </div>
                </form>
            </div>
        </Panel>
    </Transition>
</template>

<style scoped>
legend,
:deep(label p),
:deep(label span) {
    font-size: medium;
}

:deep(fieldset label p) {
    font-size: 14px;
}
</style>