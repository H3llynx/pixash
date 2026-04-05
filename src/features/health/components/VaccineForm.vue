<script setup lang="ts">
import { CalendarCheck, CalendarClock } from '@lucide/vue';
import { reactive, ref, watch } from 'vue';
import Button from '../../../components/Button.vue';
import FormWrapper from '../../../components/FormWrapper.vue';
import Input from '../../../components/Input.vue';
import Toggle from '../../../components/Toggle.vue';
import { dateFromInput, shallowEqual } from '../../../utils';
import { usePets } from '../../pets/composables/usePet';
import { getAge, getIcon } from '../../pets/utils';
import { STAGE, vaccineFields } from '../config';
import type { VaccineTypes } from '../types';
import { getVaccineTypes } from '../utils';

const { selectedPet, isAddingHealth, isUpdatingHealth, addNewVaccine } = usePets();

const { type, stage, givenDate, dueDate, nextDose, vet, notes } = vaccineFields;
const vaccineTypes = ref();
const formData = reactive({
    type: [],
    stage: "adult" as typeof STAGE[number],
    givenAt: "",
    nextDose: false,
    dueOn: "",
    repeatEveryMonths: "",
    vet: "",
    notes: "",
});

const handleClose = () => {
    isAddingHealth.vaccine = false;
    isUpdatingHealth.vaccine = false;
};

const handleSubmit = () => {
    if (!selectedPet.value) return;
    if (isAddingHealth.vaccine) addNewVaccine({ ...formData }, selectedPet.value.id);
    else {
        if (selectedPet.value && !shallowEqual(formData, selectedPet.value)) {
            console.log("update");
        }
    }
};

watch(selectedPet, (pet) => {
    if (!pet) return;
    const vaccines = getVaccineTypes(pet.species);
    vaccineTypes.value = vaccines;
    Object.assign(formData, {
        type: [vaccineTypes.value[0].id],
        stage: getAge(pet)?.stage as typeof STAGE[number],
    })
}, { immediate: true });
</script>

<template>
    <Transition name="panel">
        <FormWrapper v-if="selectedPet && (isAddingHealth.vaccine || isUpdatingHealth.vaccine)" :onClose="handleClose">
            <h1 class="my-1 default-padding" v-if="isAddingHealth.vaccine">Add vaccine</h1>
            <h1 class="my-1 default-padding" v-if="isUpdatingHealth.vaccine">Edit vaccine</h1>
            <form @submit.prevent="handleSubmit">
                <fieldset class="default-padding flex-wrap">
                    <legend>{{ type.label }}</legend>
                    <Input v-model="formData.type" v-for="option in vaccineTypes" :id="option.id" :value="option.id"
                        :key="option.id" :label="option.label" :type="type.type" />
                </fieldset>
                <fieldset class="default-padding capitalize my-0.5">
                    <legend>{{ stage.label }}</legend>
                    <Input v-model="formData.stage" v-for="(option, index) in stage.options" :id="option"
                        :value="option" :key="option" :label="option" :type="stage.type" :name="stage.name"
                        :required="index === 0" />
                </fieldset>
                <div class="default-padding flex flex-col gap-0.5">
                    <Input v-model="formData.givenAt" :id="givenDate.id" :label="givenDate.label" :type="givenDate.type"
                        required>
                        <template #addon>
                            <CalendarCheck class="mr-0.5" color="var(--color-border)" />
                        </template>
                    </Input>
                    <Toggle v-model="formData.nextDose" :label="nextDose.label" :id="nextDose.id" />
                    <Input v-if="formData.nextDose" v-model="formData.dueOn" :id="dueDate.id" :label="dueDate.label"
                        :type="dueDate.type" required>
                        <template #addon>
                            <CalendarClock class="mr-0.5" color="var(--color-border)" />
                        </template>
                    </Input>
                    <Input v-model="formData.vet" :id="vet.id" :type="vet.type" :label="vet.label" />
                    <label :for="notes.id">
                        <p>{{ notes.label }}</p>
                        <textarea v-model="formData.notes" :id="notes.id" />
                    </label>
                    <div class="flex gap-1 mt-1 items-center">
                        <div class="flex flex-wrap gap-[5px] items-center flex-1">
                            <span>{{ getIcon(selectedPet) }} {{ selectedPet.name }} · </span>
                            <span>{{vaccineTypes.find((v: VaccineTypes) => v.id ===
                                String(formData.type)).label}}</span>
                            <p v-if="formData.dueOn" class="text-text-secondary w-full">Next due: {{
                                dateFromInput(formData.dueOn) }}
                            </p>
                        </div>
                        <Button size="sm">Save vaccine</Button>
                    </div>
                </div>
            </form>
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
</style>