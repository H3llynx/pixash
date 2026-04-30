<script setup lang="ts">
import { CalendarCheck, CalendarClock, Trash2 } from '@lucide/vue';
import { computed, provide, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import FormWrapper from '../../../../components/FormWrapper.vue';
import Input from '../../../../components/Input.vue';
import LoadingPuppy from '../../../../components/loading/LoadingPuppy.vue';
import Selector from '../../../../components/Selector.vue';
import Toggle from '../../../../components/Toggle.vue';
import { useDialog } from '../../../../composables/useDialog';
import { useFormMode } from '../../../../composables/useFormMode';
import { useToast } from '../../../../composables/useToast';
import { dateFromInput, getOneYearLaterInput, tsToDate } from '../../../../utils';
import PetSelector from '../../../pets/components/PetSelector.vue';
import { usePets } from '../../../pets/composables/usePets';
import { getAge, getIcon } from '../../../pets/utils';
import { STAGE, VACCINE_TYPES, vaccineFields } from '../../config';
import type { VaccineExtended, VaccineTypes } from '../../types';
import { getVaccineTypes, resetForm, showTypes } from '../../utils';
import VetFormSelector from './VetFormSelector.vue';

const { selectedPet, isAddingHealth, vets, selectedVet, selectedVaccine, selectVaccine, addNewVaccine, healthError, healthLoading, updateSelectedVaccine, deleteSelectedVaccine, selectedDate } = usePets();
const { show } = useToast();
const { open } = useDialog();
const { t } = useI18n();
const { mode, isReadonly } = useFormMode();
provide('readonly', isReadonly);

const { types, stage, given, givenDate, dueDate, nextDose, vet, notes } = vaccineFields;
const vaccineTypes = ref<VaccineTypes[]>([]);
const error = ref<boolean>(false);
const vetTextInput = ref<boolean>(false);
const defaultForm = {
    types: [VACCINE_TYPES.default[0].id] as VaccineTypes["id"][],
    stage: "adult" as typeof STAGE[number]["id"],
    given: false,
    givenAt: "",
    nextDose: false,
    dueOn: "",
    vet: "",
    notes: "",
};
const fillVaccineData = (vaccine: VaccineExtended) => {
    const isRegisteredVet = vets.value?.some(vet => vet.id === vaccine.vet);
    vetTextInput.value = !isRegisteredVet;
    Object.assign(formData, {
        types: [...vaccine.types],
        stage: vaccine.stage,
        given: vaccine.givenAt ? true : false,
        givenAt: tsToDate(vaccine.givenAt, "input"),
        nextDose: vaccine.dueOn ? true : false,
        dueOn: tsToDate(vaccine.dueOn, "input"),
        vet: vaccine.vet ?? "",
        notes: vaccine.notes ?? "",
    })
};
const formData = reactive({ ...defaultForm });
const isVisible = computed(() => isAddingHealth.vaccine || mode.value === 'edit');
const handleClose = () => {
    error.value = false;
    selectedDate.value = null;
    isAddingHealth.vaccine = false;
    selectVaccine(null);
};

const handleSubmit = async () => {
    if (!selectedPet.value) return;
    if (!formData.types.length) {
        error.value = true;
        return;
    };
    const typesSnapshot = [...formData.types];
    try {
        if (isAddingHealth.vaccine) {
            await addNewVaccine({ ...formData }, selectedPet.value.id);
            show({
                type: "success",
                title: t("toast.success.title.generic"),
                message: t("toast.success.message.vaccineAdded", { name: selectedPet.value.name, type: showTypes(typesSnapshot, selectedPet.value) }),
            });
        }
        else if (selectedVaccine.value) {
            await updateSelectedVaccine(selectedVaccine.value, selectedPet.value.id, { ...formData });
            show({
                type: "success",
                title: t("toast.success.title.generic"),
                message: t("toast.success.message.vaccineUpdated", { name: selectedPet.value.name, type: showTypes(typesSnapshot, selectedPet.value) }),
            });
        }
    }
    catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
    };
};

const handleDelete = async () => {
    const pet = selectedPet.value;
    const vaccine = selectedVaccine.value;
    if (!vaccine || !pet) return;
    open({
        title: t("dialog.deleteVaccine.title", { type: showTypes(vaccine.types, pet) }),
        message: t("dialog.deleteVaccine.message", { name: pet.name, type: showTypes(vaccine.types, pet) }),
        isDelete: true,
        onConfirm: async () => {
            try {
                await deleteSelectedVaccine(vaccine, pet.id);
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.vaccineDeleted", { name: pet.name, type: showTypes(vaccine.types, pet) }),
                });
            } catch (error) {
                show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
            }
        }
    });
};

watch([() => isAddingHealth.vaccine, selectedVaccine],
    async ([adding, editing]) => {
        if (adding) {
            formData.dueOn = selectedDate.value ?? "";
            formData.vet = selectedVet.value?.id ?? vets.value?.[0]?.id ?? "";
        }
        if (editing) {
            mode.value = "view";
        }
    }
);

watch(() => mode.value, (mode) => {
    if (mode === "view") fillVaccineData(selectedVaccine.value!)
})

watch(() => [selectedPet.value, selectedVaccine.value] as const,
    ([pet, vaccine]) => {
        if (!pet) {
            resetForm(formData, defaultForm);
            return;
        };
        const options = getVaccineTypes(pet.species);
        if (!options || !options.length) return;
        vaccineTypes.value = options;
        if (vaccine) fillVaccineData(vaccine);
        else {
            resetForm(formData, defaultForm);
            Object.assign(formData, {
                types: [vaccineTypes.value[0].id],
                stage: getAge(pet)?.stage,
                dueOn: selectedDate.value ?? "",
                vet: selectedVet.value?.id ?? vets.value?.[0]?.id ?? ""
            });
        }
    },
    { immediate: true }
);

watch(() => formData.nextDose, () => {
    if (formData.givenAt && !formData.nextDose) formData.dueOn = "";
    else formData.dueOn = selectedVaccine.value?.dueOn
        ? tsToDate(selectedVaccine.value.dueOn, "input") as string
        : getOneYearLaterInput(formData.givenAt) ?? ""
});

watch(() => formData.given, () => {
    if (!formData.given) formData.givenAt = "";
    else formData.givenAt = selectedVaccine.value?.givenAt
        ? tsToDate(selectedVaccine.value.givenAt, "input") as string
        : ""
});
</script>

<template>
    <Transition name="panel">
        <FormWrapper v-if="isAddingHealth.vaccine || selectedVaccine" :onClose="handleClose">
            <LoadingPuppy v-if="healthLoading" />
            <div class="md:max-w-max" v-else>
                <div class="flex gap-1 justify-between my-1 default-padding">
                    <h1 v-if="isAddingHealth.vaccine">{{ t("health.title.addVaccine") }}</h1>
                    <h1 v-else-if="selectedVaccine && mode === 'edit'">{{ t("health.title.editVaccine") }}</h1>
                    <h1 v-else-if="selectedVaccine && mode === 'view'" class="font-medium">{{ getIcon(selectedPet!)
                    }} {{
                            selectedPet!.name
                        }} · {{ showTypes(formData.types, selectedPet!) }}</h1>
                    <div class="ml-auto mb-auto flex gap-0.5">
                        <Button v-if="selectedVaccine" variant="ghost" size="xs"
                            :aria-label="t('health.cta.deleteVaccine')" @click="handleDelete">
                            <Trash2 :size="22" color="var(--color-brand-light)" />
                        </Button>
                    </div>
                </div>
                <PetSelector v-if="isAddingHealth.vaccine" form />
                <form @submit.prevent="handleSubmit" class="mt-1">
                    <Selector :legend="t(types.label)">
                        <Input v-model="formData.types"
                            v-for="option in isReadonly ? vaccineTypes.filter(o => formData.types.includes(o.id)) : vaccineTypes"
                            :id="option.id" :value="option.id" :key="option.id" :label="option.label" :type="types.type"
                            @input="error = false" />
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
                        <Toggle v-if="isVisible" v-model="formData.given"
                            :label="t(given.label, { name: selectedPet!.name })" :id="given.id" />
                        <Input v-if="formData.given && isVisible" v-model="formData.givenAt" :id="givenDate.id"
                            :label="t(givenDate.label)" :type="givenDate.type" required>
                            <template #addon>
                                <CalendarCheck class=" mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <div v-else-if="selectedVaccine?.givenAt && mode === 'view'">
                            <p>{{ t(givenDate.label) }}</p>
                            <p class="read-only">{{ tsToDate(selectedVaccine.givenAt, "date") }}</p>
                        </div>
                        <Toggle v-if="formData.given && isVisible" v-model="formData.nextDose"
                            :label="t(nextDose.label)" :id="nextDose.id" />
                        <Input v-if="(!formData.given || formData.nextDose) && isVisible" v-model="formData.dueOn"
                            :id="dueDate.id" :label="t(dueDate.label)" :type="dueDate.type" :min="formData.givenAt"
                            required>
                            <template #addon>
                                <CalendarClock class="mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <div v-else-if="selectedVaccine?.dueOn && mode === 'view'">
                            <p>{{ t(dueDate.label) }}</p>
                            <p class="read-only">{{ tsToDate(selectedVaccine.dueOn, "date") }}</p>
                        </div>
                        <VetFormSelector v-if="isVisible" :vet="vet" v-model="formData.vet"
                            v-model:vetTextInput="vetTextInput" />
                        <div v-else-if="selectedVaccine?.vet && mode === 'view'">
                            <p>{{ t(vet.label) }}</p>
                            <p class="read-only">{{vets?.find(vet => vet.id === selectedVaccine!.vet)?.name ??
                                selectedVaccine.vet}}</p>
                        </div>
                        <label :for="notes.id" v-if="isVisible">
                            <p>{{ t(notes.label) }}</p>
                            <textarea v-model="formData.notes" :id="notes.id"
                                :readonly="!!selectedVaccine && mode === 'view'" />
                        </label>
                        <div v-else-if="selectedVaccine?.notes && mode === 'view'">
                            <p>{{ t(notes.label) }}</p>
                            <p class="read-only">{{ selectedVaccine.notes }}</p>
                        </div>
                        <div class="flex gap-1 mt-1 items-center" v-if="!selectedVaccine || mode === 'edit'">
                            <div class="flex flex-wrap gap-[5px] items-center flex-1">
                                <p v-if="selectedPet" class="font-medium">{{ getIcon(selectedPet) }} {{
                                    selectedPet.name
                                }} · {{
                                        showTypes(formData.types, selectedPet) }}</p>
                                <p v-if="formData.dueOn" class="text-text-secondary w-full">{{
                                    t("health.sharedDateFields.dueDate")
                                }}:
                                    {{
                                        dateFromInput(formData.dueOn) }}
                                </p>
                            </div>
                            <div class="flex gap-0.5 flex-col md:flex-row">
                                <Button type="button" v-if="selectedVaccine && mode === 'edit'" variant="secondary"
                                    size="sm" :disabled="healthLoading" @click="mode = 'view'">
                                    {{ t("common.button.cancel") }}
                                </Button>
                                <Button size="sm" :disabled="healthLoading">{{ t("health.cta.saveVaccine")
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
        </FormWrapper>
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