<script setup lang="ts">
import { Edit2, Plus, Trash2, X } from '@lucide/vue';
import { computed } from '@vue/reactivity';
import { onClickOutside } from '@vueuse/core';
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { resetState } from '../../../utils';
import type { VaccineExtended } from '../../health/types';
import { usePets } from '../composables/usePets';
import type { Pet, PetExtended } from '../types';
import { getUnit, kgToGrams } from '../utils';

const { updateSelectedPet, deleteSelectedPetField, selectedPet, selectPet, selectVaccine, isAddingHealth } = usePets();
const { t } = useI18n();

const props = defineProps<{
    pet: PetExtended
    data: "weight" | "microchip" | "nextVaccine"
}>();

const isUpdating = defineModel();

const updateForm = ref<HTMLFormElement>();
const inputRef = ref<HTMLInputElement>();

onClickOutside(updateForm, () => {
    if (isUpdating.value) {
        isUpdating.value = false;
    }
});

const preferredUnit = computed(() => {
    return getUnit(props.pet) ? "kg" : "g"
});

const formData = reactive<{
    data: string;
    unit: "kg" | "g";
}>({
    data: "",
    unit: preferredUnit.value,
});

const startUpdating = () => {
    selectPet(props.pet);
    formData.data = "";
    isUpdating.value = true;
    const existing = props.pet[props.data];
    if (props.data === "weight" && typeof existing === "number") {
        formData.data = preferredUnit.value === "kg"
            ? (existing / 1000).toString()
            : existing.toString();
    } else if (props.data === "microchip" && typeof existing === "string") {
        formData.data = existing;
    } else if (props.data === "nextVaccine") {
        resetState(isAddingHealth);
        if (existing) {
            selectVaccine(existing as VaccineExtended);
        }
        else isAddingHealth.vaccine = true;
        isUpdating.value = false;
    }
};

const handleUnitChange = () => {
    inputRef.value?.focus()
};

const handleSubmit = async (field: "weight" | "microchip") => {
    if (!selectedPet.value || !formData.data) return;
    let update: Partial<Pick<Pet, "weight" | "microchip" | "microchipped">> = {};
    if (field === "weight") {
        const numeric = Number(formData.data);
        if (Number.isNaN(numeric) || numeric <= 0) return;
        const grams = formData.unit === "kg" ? kgToGrams(numeric) : numeric;
        if (selectedPet.value.weight === grams) return;
        update = { weight: grams };
    } else {
        const microchip = formData.data;
        if (selectedPet.value.microchip === microchip) return;
        update = { microchipped: true, microchip: microchip };
    }
    await updateSelectedPet(selectedPet.value, update);
    isUpdating.value = false;
};

const handleDelete = async () => {
    if (!selectedPet.value) return;
    await deleteSelectedPetField(selectedPet.value, props.data as keyof Pet);
    if (props.data === "microchip") await updateSelectedPet(selectedPet.value, { microchipped: false });

};

watch(preferredUnit, (unit) => {
    formData.unit = unit;
});

watch(() => formData.unit,
    (newUnit, oldUnit) => {
        if (props.data !== "weight" || !formData.data) return;
        const value = parseFloat(formData.data);
        if (isNaN(value)) return;
        if (oldUnit === "kg" && newUnit === "g") {
            formData.data = Math.round(value * 1000).toString()
        }
        else if (oldUnit === "g" && newUnit === "kg") {
            formData.data = (value / 1000).toFixed(3)
        }
    }
);
</script>

<template>
    <div class="flex h-2 gap-[3px]">
        <Button v-if="!isUpdating || data === 'nextVaccine'" variant="summaryCta" size="xxs" @click="startUpdating"
            :aria-label="t('pet.profile.edit.' + data)">
            <Edit2 v-if="pet[data]" :size="16" />
            <Plus v-else :size="18" />
        </Button>
        <form @submit.prevent="handleSubmit(data)" @keydown.enter.exact="handleSubmit(data)"
            v-else-if="pet === selectedPet" class="profile-mini-form flex gap-[3px]" ref="updateForm">
            <input v-model="formData.data" :type="data === 'weight' ? 'number' : 'text'" :id="`pet-${data}`"
                :step="data === 'weight' ? (formData.unit === 'kg' ? '0.001' : '1') : 'any'" ref="inputRef"
                class="text-base">
            <div class="input-container" v-if="data === 'weight'">
                <select v-model="formData.unit" v-if="data === 'weight'" @change="handleUnitChange">
                    <option>kg</option>
                    <option>g</option>
                </select>
            </div>
        </form>
        <Button v-if="isUpdating && data !== 'nextVaccine' && pet === selectedPet" size="xxs" variant="ghost"
            @click="isUpdating = false">
            <X :size="18" color="var(--color-brand-light)" />
        </Button>
        <Button v-if="isUpdating && data !== 'nextVaccine' && pet === selectedPet" size="xxs" variant="ghost"
            @click="handleDelete">
            <Trash2 :size="18" color="var(--color-brand-light)" />
        </Button>
    </div>
</template>

<style scoped>
input,
select {
    border-radius: 0.5rem;
    padding: 3px 0.5rem;
}

input {
    font-weight: 500;
}

select {
    width: 3rem;
}
</style>