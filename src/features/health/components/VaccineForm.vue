<script setup lang="ts">
import { CalendarCheck, CalendarClock, Trash2 } from '@lucide/vue';
import { nextTick, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import FormWrapper from '../../../components/FormWrapper.vue';
import Input from '../../../components/Input.vue';
import Toggle from '../../../components/Toggle.vue';
import { useDialog } from '../../../composables/useDialog';
import { useToast } from '../../../composables/useToast';
import { dateFromInput, getOneYearLaterInput, shallowEqual, tsToDate } from '../../../utils';
import { usePets } from '../../pets/composables/usePet';
import { getAge, getIcon } from '../../pets/utils';
import { STAGE, VACCINE_TYPES, vaccineFields } from '../config';
import type { VaccineTypes } from '../types';
import { getVaccineTypes, showTypes } from '../utils';

const { selectedPet, isAddingHealth, selectedVaccine, selectVaccine, addNewVaccine, healthError, healthLoading, updateSelectedVaccine, deleteSelectedVaccine } = usePets();
const { show } = useToast();
const { open } = useDialog();
const { t } = useI18n();

const { types, stage, given, givenDate, dueDate, nextDose, vet, notes } = vaccineFields;
const vaccineTypes = ref<VaccineTypes[]>([]);
const error = ref<boolean>(false)
const vaccineSelectorRef = ref<HTMLDivElement>();
const defaultForm = {
    types: [VACCINE_TYPES.default[0].id],
    stage: "adult" as typeof STAGE[number],
    given: false,
    givenAt: "",
    nextDose: false,
    dueOn: "",
    vet: "",
    notes: "",
};
const formData = reactive({ ...defaultForm });
const resetForm = () => {
    Object.assign(formData, defaultForm)
};

const handleClose = () => {
    isAddingHealth.vaccine = false;
    selectVaccine(null);
};

const handleSubmit = async () => {
    if (!selectedPet.value) return;
    if (!formData.types.length) {
        error.value = true;
        return;
    };
    try {
        if (isAddingHealth.vaccine) {
            await addNewVaccine({ ...formData }, selectedPet.value.id);
            show({
                type: "success",
                title: t("toast.success.title.generic"),
                message: t("toast.success.message.vaccineAdded", { name: selectedPet.value.name, type: showTypes(formData.types, selectedPet.value) }),
            });
        }
        else if (selectedVaccine.value && !shallowEqual(formData, selectedVaccine.value)) {
            await updateSelectedVaccine(selectedVaccine.value, selectedPet.value.id, { ...formData });
            show({
                type: "success",
                title: t("toast.success.title.generic"),
                message: t("toast.success.message.vaccineUpdated", { name: selectedPet.value.name, type: showTypes(formData.types, selectedPet.value) }),
            });
        }
    }
    catch (e) {
        show({ type: "error", title: "Error", message: healthError.value || "" });
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
            } catch (error) { console.log(error) }
        }
    });
};

watch(() => [isAddingHealth.vaccine, selectedVaccine.value],
    ([adding, editing]) => {
        if (editing || adding) {
            nextTick(() => {
                const petInputs = vaccineSelectorRef.value?.querySelectorAll("input");
                if (petInputs) petInputs[0].focus();
            });
        }
    });


watch(() => [selectedPet.value, selectedVaccine.value] as const,
    ([pet, vaccine]) => {
        if (!pet) {
            resetForm();
            return
        };
        const options = getVaccineTypes(pet.species);
        if (!options || !options.length) return;
        vaccineTypes.value = options;
        if (vaccine) {
            Object.assign(formData, {
                types: [...vaccine.types],
                stage: vaccine.stage,
                given: vaccine.givenAt ? true : false,
                givenAt: tsToDate(vaccine.givenAt, "input"),
                nextDose: vaccine.dueOn ? true : false,
                dueOn: tsToDate(vaccine.dueOn, "input"),
                vet: vaccine.vet ?? "",
                notes: vaccine.notes ?? "",
            });
        }
        else {
            Object.assign(formData, {
                types: [vaccineTypes.value[0].id],
                stage: getAge(pet)?.stage as (typeof STAGE)[number],
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
        <FormWrapper v-if="selectedPet && (isAddingHealth.vaccine || selectedVaccine)" :onClose="handleClose">
            <div class="md:max-w-max">
                <div class="flex gap-1 justify-between my-1 default-padding">
                    <h1>
                        {{ isAddingHealth.vaccine
                            ? t("health.title.addVaccine")
                            : t("health.title.editVaccine")
                        }}
                    </h1>
                    <Button class="ml-auto mb-auto" variant="ghost" size="xs" :aria-label="t('health.cta.delete')"
                        @click="handleDelete">
                        <Trash2 :size="22" color="var(--color-brand-light)" />
                    </Button>
                </div>
                <form @submit.prevent="handleSubmit" class="md:max-w-max">
                    <fieldset ref="vaccineSelectorRef" class="default-padding flex-wrap">
                        <legend>{{ t(types.label) }}</legend>
                        <Input v-model="formData.types" v-for="option in vaccineTypes" :id="option.id"
                            :value="option.id" :key="option.id" :label="option.label" :type="types.type"
                            @input="error = false" />
                        <p v-if="error" class="text-sm w-full text-error pb-0.5">{{
                            t("health.form.validationTypes") }}</p>
                    </fieldset>
                    <fieldset class="default-padding capitalize my-0.5">
                        <legend>{{ t(stage.label) }}</legend>
                        <Input v-model="formData.stage" v-for="(option, index) in stage.options" :id="option"
                            :value="option" :key="option" :label="option" :type="stage.type" :name="stage.name"
                            :required="index === 0" />
                    </fieldset>
                    <div class="default-padding flex flex-col gap-0.5">
                        <Toggle v-model="formData.given" :label="t(given.label, { name: selectedPet.name })"
                            :id="given.id" />
                        <Input v-if="formData.given" v-model="formData.givenAt" :id="givenDate.id"
                            :label="t(givenDate.label)" :type="givenDate.type" required>
                            <template #addon>
                                <CalendarCheck class=" mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <Toggle v-if="formData.given" v-model="formData.nextDose" :label="t(nextDose.label)"
                            :id="nextDose.id" />
                        <Input v-if="!formData.given || formData.nextDose" v-model="formData.dueOn" :id="dueDate.id"
                            :label="t(dueDate.label)" :type="dueDate.type" :min="formData.givenAt" required>
                            <template #addon>
                                <CalendarClock class="mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <Input v-model="formData.vet" :id="vet.id" :type="vet.type" :label="t(vet.label)" />
                        <label :for="notes.id">
                            <p>{{ t(notes.label) }}</p>
                            <textarea v-model="formData.notes" :id="notes.id" />
                        </label>
                        <div class="flex gap-1 mt-1 items-center text-sm">
                            <div class="flex flex-wrap gap-[5px] items-center flex-1">
                                <p class="font-medium">{{ getIcon(selectedPet) }} {{ selectedPet.name }} · {{
                                    showTypes(formData.types, selectedPet)
                                }}</p>
                                <p v-if="formData.dueOn" class="text-text-secondary w-full">{{ t("health.form.dueDate")
                                }}:
                                    {{
                                        dateFromInput(formData.dueOn) }}
                                </p>
                            </div>
                            <Button size="sm" :disabled="healthLoading">{{ t("health.cta.save") }}</Button>
                        </div>
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

:deep(label:has(input[type="text"]:not(:required)) p::after),
label:has(textarea) p::after {
    content: "(optional)";
    margin-left: 10px;
    color: var(--color-text-secondary);
    font-size: small;
}

;
</style>