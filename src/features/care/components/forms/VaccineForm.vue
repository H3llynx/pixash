<script setup lang="ts">
import { CalendarCheck, CalendarClock, Trash2 } from '@lucide/vue';
import { provide, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Input from '../../../../components/Input.vue';
import LoadingPuppy from '../../../../components/loading/LoadingPuppy.vue';
import Panel from '../../../../components/Panel.vue';
import Selector from '../../../../components/Selector.vue';
import Textarea from '../../../../components/Textarea.vue';
import Toggle from '../../../../components/Toggle.vue';
import { useFormMode } from '../../../../composables/useFormMode.ts';
import { dateFromInput, todayAsInput } from '../../../../utils.ts';
import PetIcon from '../../../pets/components/PetIcon.vue';
import PetSelector from '../../../pets/components/PetSelector.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import { vaccineFields } from '../../config.ts';
import { showVaccines } from '../../utils.ts';
import { useVaccineForm } from './composables/useVaccineForm.ts';
import VetSelector from './VetSelector.vue';

const { selectedPet, isAddingCare, selectedVaccine, vetLoading } = usePets();
const { t } = useI18n();
const { mode, isReadonly } = useFormMode();
const { vetTextInput, givenBy, fillVaccineData, formData, vaccineTypes, error, handleClose, handleSubmit, handleDelete, loading } = useVaccineForm();
provide('readonly', isReadonly);
const { types, stage, given, givenDate, dueDate, nextDose, vet, notes } = vaccineFields;
const today = todayAsInput();

watch(() => selectedVaccine.value, (vaccine) => {
    mode.value = vaccine ? "view" : "edit";
});

watch(() => mode.value, (mode) => {
    if (mode === "view") fillVaccineData(selectedVaccine.value!)
});

watch(() => isAddingCare.vaccine, (adding) => {
    if (adding) {
        mode.value = "edit";
        formData.vet = givenBy.value;
    }
});
</script>

<template>
    <Transition name="panel">
        <Panel v-if="isAddingCare.vaccine || selectedVaccine" :onClose="handleClose">
            <LoadingPuppy v-if="loading || vetLoading" />
            <div class="md:max-w-max" v-else>
                <div class="flex gap-1 justify-between my-1 default-padding">
                    <h1 v-if="isAddingCare.vaccine">{{ t("health.title.addVaccine") }}</h1>
                    <h1 v-else-if="selectedVaccine && mode === 'edit'">{{ t("health.title.editVaccine") }}</h1>
                    <div v-else-if="selectedVaccine && mode === 'view'"
                        class="flex gap-0.5 items-center flex-1 font-medium">
                        <div v-if="selectedPet"
                            class="rounded-full w-3 h-3 bg-brand-rgba text-3xl flex shrink-0 justify-center items-center">
                            <PetIcon :pet="selectedPet" />
                        </div>
                        <h1>{{ selectedPet!.name }} · {{ showVaccines(formData.types, selectedPet!, t) }}</h1>
                    </div>
                    <div class="ml-auto mb-auto flex gap-0.5">
                        <Button v-if="selectedVaccine" variant="ghost" size="xs"
                            :aria-label="t('health.cta.deleteVaccine')" @click="handleDelete">
                            <Trash2 :size="22" color="var(--color-brand-light)" />
                        </Button>
                    </div>
                </div>
                <PetSelector v-if="isAddingCare.vaccine" form />
                <form @submit.prevent="handleSubmit" class="mt-1">
                    <Selector :legend="t(types.label)">
                        <Input v-model="formData.types"
                            v-for="option in isReadonly ? vaccineTypes.filter(o => formData.types.includes(o.id)) : vaccineTypes"
                            :id="option.id" :value="option.id" :key="option.id" :label="t(option.label)"
                            :type="types.type" @input="error = false" />
                        <p v-if="error" class="text-sm w-full text-error pb-0.5">{{
                            t("health.vaccineForm.validationTypes") }}</p>
                    </Selector>
                    <Selector :legend="t(stage.label)" class="my-0.5">
                        <Input v-model="formData.stage"
                            v-for="(option, index) in isReadonly ? stage.options.filter(o => formData.stage.includes(o.id)) : stage.options"
                            :id="option.id" :value="option.id" :key="option.id" :label="t(option.label)"
                            :type="stage.type" :name="stage.name" :required="index === 0" />
                    </Selector>
                    <div class="default-padding flex flex-col gap-1">
                        <Toggle v-if="mode === 'edit'" v-model="formData.given"
                            :label="t(given.label, { name: selectedPet!.name })" :id="given.id" />
                        <Input v-if="formData.given" v-model="formData.givenAt" :id="givenDate.id" :max="today"
                            :label="t(givenDate.label)" :type="givenDate.type" required>
                            <template #addon>
                                <CalendarCheck class=" mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <Toggle v-if="formData.given && mode === 'edit'" v-model="formData.nextDose"
                            :label="t(nextDose.label)" :id="nextDose.id" />
                        <Input v-if="(!formData.given || formData.nextDose)" v-model="formData.dueOn" :id="dueDate.id"
                            :label="t(dueDate.label)" :type="dueDate.type" :min="formData.givenAt || today" required>
                            <template #addon>
                                <CalendarClock class="mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <VetSelector :vet="vet" v-model="formData.vet" v-model:vetTextInput="vetTextInput" />
                        <div class="flex flex-col">
                            <label :for="notes.id" v-if="selectedVaccine?.notes || mode === 'edit'">
                                <p>{{ t(notes.label) }}</p>
                                <Textarea v-model="formData.notes" :id="notes.id"
                                    :readonly="!!selectedVaccine && mode === 'view'" :placeholder="t(notes.placeholder)"
                                    :maxlength="500" />
                            </label>
                        </div>

                        <div class="flex gap-1 mt-1 justify-between items-center flex-wrap"
                            v-if="!selectedVaccine || mode === 'edit'">
                            <div
                                class="rounded-full w-3 h-3 bg-brand-rgba text-3xl flex shrink-0 justify-center items-center">
                                <PetIcon :pet="selectedPet!" />
                            </div>
                            <div class="flex-1">
                                <p v-if="selectedPet" class="font-medium">
                                    {{
                                        selectedPet.name
                                    }} · {{
                                        showVaccines(formData.types, selectedPet, t) }}
                                </p>
                                <p v-if="formData.dueOn" class="text-text-secondary w-full">{{
                                    t("health.sharedFields.dueDate")
                                }}:
                                    {{
                                        dateFromInput(formData.dueOn) }}
                                </p>
                            </div>
                            <div class="flex gap-0.5 flex-col-reverse md:flex-row shrink-0 w-full sm:w-max">
                                <Button type="button" v-if="selectedVaccine && mode === 'edit'" variant="secondary"
                                    size="sm" :disabled="loading" @click="mode = 'view'">
                                    {{ t("common.button.cancel") }}
                                </Button>
                                <Button size="sm" :disabled="loading">{{ t("health.cta.saveVaccine")
                                }}</Button>
                            </div>
                        </div>
                        <Button v-if="selectedVaccine && mode === 'view'" size="sm" class="mt-1 md:ml-auto"
                            @click="mode = 'edit'">
                            {{ t("health.title.editVaccine") }}
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