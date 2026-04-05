<script setup lang="ts">
import { computed, reactive, Transition, watch } from 'vue';
import Button from '../../../components/Button.vue';
import Dropdown from '../../../components/Dropdown.vue';
import FormWrapper from '../../../components/FormWrapper.vue';
import Paw from '../../../components/icons/Paw.vue';
import Input from '../../../components/Input.vue';
import Toggle from '../../../components/Toggle.vue';
import { shallowEqual } from '../../../utils';
import { usePets } from '../composables/usePet';
import { petFields } from '../config';
import type { Pet } from '../types';

const { name, species, breed, birthDate, sex, sterilized, microchipped } = petFields;
const { isAddingPet, isUpdating, hasPets, addNewPet, selectedPet, updateSelectedPet } = usePets();

const existingPet = computed<Pet | null>(() => {
    if (isAddingPet.value || !selectedPet.value) return null;
    else return selectedPet.value;
})

const defaultForm: Pet = {
    name: "",
    species: species.options[0].name,
    breed: "",
    birthDate: "",
    sex: sex.options[0],
    sterilized: true,
    microchipped: false,
};

const resetForm = () => {
    Object.assign(formData, defaultForm)
};

const formData = reactive<Pet>({ ...defaultForm });

const getBreedOptions = (species: string) => {
    if (species === "dog") return breed.dogOptions;
    if (species === "cat") return breed.catOptions;
    return []
};
const selectedSpecies = computed(() =>
    species.options.find(s => s.name === formData.species)
);
const hasBreed = computed(() => selectedSpecies.value?.hasBreed ?? false);

const handleSubmit = () => {
    if (isAddingPet.value) addNewPet({ ...formData });
    else {
        if (selectedPet.value && !shallowEqual(formData, selectedPet.value)) {
            updateSelectedPet(selectedPet.value, formData);
        }
    }
};

const handleClose = () => {
    isAddingPet.value = false;
    isUpdating.generalInfo = false;
};

watch(existingPet, (pet) => {
    if (!pet) {
        resetForm();
        return;
    }
    Object.assign(formData, {
        name: pet.name,
        species: pet.species,
        breed: pet.breed ?? "",
        birthDate: pet.birthDate,
        sex: pet.sex,
        sterilized: pet.sterilized,
        microchipped: pet.microchipped
    })
}, { immediate: true });
</script>

<template>
    <Transition name="panel">
        <FormWrapper v-if="isAddingPet || isUpdating.generalInfo" :canClose="hasPets" :onClose="handleClose">
            <div v-if="!hasPets" class="px-2 py-1 text-center">
                <h2>Your pet care starts here</h2>
                <p class="text-text-secondary">You haven't added any pets yet.</p>
            </div>
            <h1 class="my-1 default-padding" v-if="isAddingPet">Add a pet</h1>
            <h1 class="my-1 default-padding" v-if="selectedPet && isUpdating.generalInfo">Edit {{ selectedPet.name }}
            </h1>
            <form @submit.prevent="handleSubmit">
                <fieldset class="min-w-0">
                    <legend class="default-padding">{{ species.label }}</legend>
                    <div class="pet-selector">
                        <Input v-model="formData.species" v-for="(option, index) in species.options" :id="option.name"
                            :value="option.name" :key="option.name" :label="option.icon" :aria-label="option.name"
                            :type="species.type" :name="species.name" :required="index === 0" />
                    </div>
                </fieldset>
                <div class="default-padding flex flex-col gap-1 max-w-md">
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
                </div>
            </form>
        </FormWrapper>
    </Transition>
</template>

<style scoped>
button {
    gap: 0.8rem;
}

legend,
:deep(label p) {
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 500;
    letter-spacing: 1px;
    padding-bottom: 10px;
}
</style>