<script setup lang="ts">
import { computed, nextTick, reactive, ref, Transition, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import Dropdown from '../../../components/Dropdown.vue';
import FormWrapper from '../../../components/FormWrapper.vue';
import Paw from '../../../components/icons/Paw.vue';
import Input from '../../../components/Input.vue';
import Toggle from '../../../components/Toggle.vue';
import { useToast } from '../../../composables/useToast';
import { shallowEqual } from '../../../utils';
import { usePets } from '../composables/usePet';
import { petFields } from '../config';
import type { Pet } from '../types';

const { name, species, breed, birthDate, sex, sterilized, microchipped } = petFields;
const { loading, pets, error, isAddingPet, isUpdating, hasPets, addNewPet, selectedPet, updateSelectedPet } = usePets();
const { show } = useToast();
const { t } = useI18n();

const petSelectorRef = ref<HTMLDivElement>();
const existingPet = computed<Pet | null>(() => {
    if (isAddingPet.value || !selectedPet.value) return null;
    else return selectedPet.value;
})
const defaultForm: Pet = {
    name: "",
    species: species.options[0].id,
    breed: "",
    birthDate: "",
    sex: sex.options[0].id,
    sterilized: true,
    microchipped: false,
};
const formData = reactive<Pet>({ ...defaultForm });
const resetForm = () => {
    Object.assign(formData, defaultForm)
};
const getBreedOptions = (species: string) => {
    if (species === "dog") return breed.dogOptions;
    if (species === "cat") return breed.catOptions;
    return []
};
const selectedSpecies = computed(() =>
    species.options.find(s => s.id === formData.species)
);
const hasBreed = computed(() => selectedSpecies.value?.hasBreed ?? false);

const handleSubmit = async () => {
    try {
        if (isAddingPet.value) {
            await addNewPet({ ...formData });
            show({
                type: "success",
                title: t("toast.success.title.generic"),
                message: t("toast.success.message.petAdded", { name: formData.name }),
            });
        } else if (selectedPet.value && !shallowEqual(formData, selectedPet.value)) {
            await updateSelectedPet(selectedPet.value, formData);
            const updated = pets.value.find(pet => pet.id === selectedPet.value!.id);
            if (updated) selectedPet.value = updated;
            show({
                type: "success",
                title: t("toast.success.title.generic"),
                message: t("toast.success.message.petUpdated", { name: formData.name }),
            });
        }
    } catch (e) {
        show({ type: "error", title: "Error", message: error.value || "" });
    }
};

const handleClose = () => {
    isAddingPet.value = false;
    isUpdating.generalInfo = false;
};

watch(() => [isAddingPet.value, isUpdating.generalInfo],
    ([adding, editing]) => {
        if (editing || adding) {
            nextTick(() => {
                const petInputs = petSelectorRef.value?.querySelectorAll("input");
                if (petInputs) petInputs[0].focus();
            });
        }
    });

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

watch(() => formData.species, () => {
    if (!hasBreed.value) formData.breed = null;
});
</script>

<template>
    <Transition name="panel">
        <FormWrapper v-if="isAddingPet || isUpdating.generalInfo" :canClose="hasPets" :onClose="handleClose">
            <div v-if="!hasPets" class="px-2 py-1 text-center">
                <h2>{{ t("pet.title.addFirstPet") }}</h2>
                <p class="text-text-secondary">{{ t("pet.addFirstPet") }}</p>
            </div>
            <h1 class="my-1 default-padding">
                {{ isAddingPet
                    ? t("pet.title.addPet")
                    : t("pet.title.editPet", { name: selectedPet?.name })
                }}
            </h1>
            <form @submit.prevent="handleSubmit" class="md:max-w-max">
                <fieldset class="min-w-0">
                    <legend class="default-padding">{{ t(species.label) }}</legend>
                    <div class="pet-selector" ref="petSelectorRef">
                        <Input v-model="formData.species" v-for="(option, index) in species.options" :id="option.id"
                            :value="option.id" :key="option.id" :label="option.icon" :aria-label="t(option.name)"
                            :type="species.type" :name="species.name" :required="index === 0" />
                    </div>
                </fieldset>
                <div class="default-padding flex flex-col gap-1">
                    <Input v-model="formData.name" :id="name.id" :type="name.type" :label="t(name.label)" required />
                    <Dropdown v-if="hasBreed" v-model="formData.breed" :id="breed.id" :label="t(breed.label)" required>
                        <option value="" disabled>{{ t(breed.placeholder) }}</option>
                        <option v-for="option in getBreedOptions(formData.species)"
                            :key="`${formData.species}-${option.value}`" :value="option.value">
                            {{ option.name }}
                        </option>
                    </Dropdown>
                    <div class="flex justify-between gap-1">
                        <Input v-model="formData.birthDate" :id="birthDate.id" :type="birthDate.type"
                            :label="t(birthDate.label)" required />
                        <Dropdown v-model="formData.sex" :id="sex.id" :label="t(sex.label)" required>
                            <option v-for="option in sex.options" :value="option.id" :key="option.id">{{ t(option.label)
                            }}
                            </option>
                        </Dropdown>
                    </div>
                    <Toggle v-model="formData.sterilized" :label="t(sterilized.label)" :id="sterilized.id" />
                    <Toggle v-model="formData.microchipped" :label="t(microchipped.label)" :id="microchipped.id" />
                    <Button :disabled="loading" class="md:ml-auto">{{ t("pet.cta.save", { name: formData.name }) }}
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