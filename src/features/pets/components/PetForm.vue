<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import Button from '../../../components/Button.vue';
import Dropdown from '../../../components/Dropdown.vue';
import Paw from '../../../components/icons/Paw.vue';
import Input from '../../../components/Input.vue';
import { useToast } from '../../../composables/useToast';
import { usePets } from '../composable/usePet';
import { petFields } from '../config';

const { name, species, breed, birthDate } = petFields;
const { error, selectedPet } = usePets();
const { show } = useToast();
const { addNewPet } = usePets();

const formData = reactive({
    name: "",
    species: species.options[0].name,
    breed: "",
    birthDate: ""
});

const getBreedOptions = (species: string) => {
    if (species === 'dog') return breed.dogOptions
    if (species === 'cat') return breed.catOptions
    return []
};
const selectedSpecies = computed(() =>
    species.options.find(s => s.name === formData.species)
);
const hasBreed = computed(() => selectedSpecies.value?.hasBreed ?? false);

const handleSubmit = () => {
    addNewPet({ ...formData });
};

watch(error, (newError) => {
    if (newError) {
        show("error", newError, "Error");
    }
});

watch(selectedPet, (newSelectedPet) => {
    if (!newSelectedPet) return;
    show("success", `${newSelectedPet.name}! has been successfully added`, "Success")
});
</script>
<template>
    <section>
        <form class="flex flex-col gap-1 w-full max-w-2xs m-auto" @submit.prevent="handleSubmit">
            <Input v-model="formData.name" :id="name.id" :type="name.type" :label="name.label" required />
            <Dropdown v-model="formData.species" :id="species.id" :label="species.label" required>
                <option v-for="option in species.options" :value="option.name" :key="option.name">{{ option.name }}
                </option>
            </Dropdown>
            <Dropdown v-if="hasBreed" v-model="formData.breed" :id="breed.id" :label="breed.label" required>
                <option value="" disabled>{{ breed.placeholder }}</option>
                <option v-for="option in getBreedOptions(formData.species)" :key="`${formData.species}-${option.value}`"
                    :value="option.value">
                    {{ option.name }}
                </option>
            </Dropdown>
            <Input v-model="formData.birthDate" :id="birthDate.id" :type="birthDate.type" :label="birthDate.label"
                required />
            <Button>Add pet
                <Paw class="w-1 -rotate-12" />
            </Button>
        </form>
    </section>
</template>

<style scoped>
button {
    gap: 0.8rem;
}
</style>