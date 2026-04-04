<script setup lang="ts">
import { CalendarCheck, CalendarClock } from '@lucide/vue';
import { reactive, ref, watch } from 'vue';
import FormWrapper from '../../../components/FormWrapper.vue';
import Input from '../../../components/Input.vue';
import Toggle from '../../../components/Toggle.vue';
import { usePets } from '../../pets/composables/usePet';
import { getAge, getVaccineTypes } from '../../pets/utils';
import { useHealth } from '../composables/useHealth';
import { vaccineFields } from '../config';

const { isAddingHealth, isUpdatingHealth } = useHealth();
const { selectedPet } = usePets();
const { type, stage, givenDate, dueDate, nextDose, vet, notes } = vaccineFields;
const vaccineTypes = ref();
const formData = reactive({
    type: "",
    stage: "",
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

}

watch(selectedPet, (pet) => {
    if (!pet) {
        return;
    }
    const vaccines = getVaccineTypes(pet.species);
    vaccineTypes.value = vaccines;
    Object.assign(formData, {
        type: [vaccineTypes.value[0].id],
        stage: getAge(pet)?.stage,
    })
}, { immediate: true });
</script>

<template>
    <Transition name="panel">
        <FormWrapper v-if="isAddingHealth.vaccine || isUpdatingHealth.vaccine" :onClose="handleClose">
            <h1 class="my-1 default-padding" v-if="isAddingHealth.vaccine">Add vaccine</h1>
            <h1 class="my-1 default-padding" v-if="isUpdatingHealth.vaccine">Edit vaccine</h1>
            <form @submit.prevent="handleSubmit">
                <fieldset class="default-padding flex-wrap">
                    <legend>{{ type.label }}</legend>
                    <Input v-model="formData.type" v-for="(option, index) in vaccineTypes" :id="option.id"
                        :value="option.id" :key="option.id" :label="option.label" :type="type.type"
                        :required="index === 0" />
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
                </div>
                <!--                 <div class="default-padding flex flex-col gap-1 max-w-md">
                    <Input v-model="formData.name" :id="name.id" :type="name.type" :label="name.label" required />
                    <Dropdown v-if="hasBreed" v-model="formData.breed" :id="breed.id" :label="breed.label" required>
                        <option value="" disabled>{{ breed.placeholder }}</option>
                        <option v-for="option in getBreedOptions(formData.species)"
                            :key="`${formData.species}-${option.value}`" :value="option.value">
                            {{ option.name }}
                        </option>
                    </Dropdown>
                    <div class="flex justify-between gap-1">
                        <Input v-model="formData.birthDate" :id="birthDate.id" :type="birthDate.type"
                            :label="birthDate.label" required />
                        <Dropdown v-model="formData.sex" :id="sex.id" :label="sex.label" required>
                            <option v-for="option in sex.options" :value="option" :key="option">{{ option }}
                            </option>
                        </Dropdown>
                    </div>
                    <Toggle v-model="formData.sterilized" :label="sterilized.label" :id="sterilized.id" />
                    <Toggle v-model="formData.microchipped" :label="microchipped.label" :id="microchipped.id" />
                    <Button>{{ isAddingPet ? "Add" : "Update" }} {{ formData.name }}
                        <Paw class="w-1 -rotate-12" />
                    </Button>
                </div> -->
            </form>
        </FormWrapper>
    </Transition>
</template>

<style scoped>
legend,
:deep(label:not(:has(input[type="checkbox"], input[type="radio"])) p):deep(label span) {
    font-weight: 500;
    font-size: medium;
}
</style>