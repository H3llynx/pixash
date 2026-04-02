<script setup lang="ts">
import { computed, reactive, Transition, watch } from 'vue';
import Button from '../../../components/Button.vue';
import Dropdown from '../../../components/Dropdown.vue';
import Paw from '../../../components/icons/Paw.vue';
import Input from '../../../components/Input.vue';
import Toggle from '../../../components/Toggle.vue';
import { useToast } from '../../../composables/useToast';
import { usePets } from '../composable/usePet';
import { petFields } from '../config';

const { name, species, breed, birthDate, sex, sterilized, microchipped } = petFields;
const { error, isAdding, stopAdding, hasPets, addNewPet } = usePets();
const { show } = useToast();

const formData = reactive({
    name: "",
    species: species.options[0].name,
    breed: "",
    birthDate: "",
    sex: sex.options[0],
    sterilized: true,
    microchipped: false,
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
</script>

<template>
    <Transition name="panel">
        <section v-if="isAdding" class="sticky bottom-0 z-1
           bg-bg-2 border-t border-border rounded-t-3xl pt-1 pb-2 p-0">
            <Button v-if="hasPets" action="hide" @click="stopAdding" />
            <div v-if="!hasPets" class="px-2 py-1 text-center">
                <h2>Your pet care starts here</h2>
                <p class="text-text-secondary">You haven't added any pets yet.</p>
            </div>
            <h1 class="my-1 default-padding">Add a pet</h1>
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
                    <Button>Add {{ formData.name }}
                        <Paw class="w-1 -rotate-12" />
                    </Button>
                </div>
            </form>
        </section>
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