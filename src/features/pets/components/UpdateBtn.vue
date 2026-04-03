<script setup lang="ts">
import { Edit2, X } from '@lucide/vue';
import { onClickOutside } from '@vueuse/core';
import { reactive, ref } from 'vue';
import Button from '../../../components/Button.vue';
import { usePets } from '../composable/usePet';
import type { Pet } from '../types';
import { getUnit, kgToGrams } from '../utils';

const { updateSelectedPet, selectedPet, isUpdating } = usePets();
const props = defineProps<{ data: "weight" | "microchip" }>();

const updateForm = ref(null);
onClickOutside(updateForm, () => {
    if (isUpdating) {
        isUpdating[props.data] = false;
    }
});

const formData = reactive<{
    data: string;
    unit: "kg" | "g";
}>({
    data: "",
    unit: "g",
});

const startUpdating = () => {
    if (!selectedPet.value) return;
    isUpdating[props.data] = true;
    const prefersKg = getUnit(selectedPet.value);
    const existing = selectedPet.value[props.data];
    if (props.data === "weight" && typeof existing === "number") {
        formData.unit = prefersKg ? "kg" : "g";
        formData.data = prefersKg
            ? (existing / 1000).toString()
            : existing.toString();
    } else if (props.data === "microchip" && existing === "string") {
        formData.data = existing;
    } else {
        formData.data = "";
        formData.unit = prefersKg ? "kg" : "g";
    }
}

const handleSubmit = (field: "weight" | "microchip") => {
    if (!selectedPet.value || !formData.data) return;
    let update: Partial<Pick<Pet, "weight" | "microchip" | "microchipped">> = {};
    if (field === "weight") {
        const numeric = Number(formData.data);
        if (Number.isNaN(numeric) || numeric <= 0) return;
        update = { weight: formData.unit === "kg" ? kgToGrams(numeric) : numeric };
    } else {
        update = { microchipped: true, microchip: String(formData.data) };
    }
    updateSelectedPet(selectedPet.value, update);
    isUpdating[props.data] = false;
}
</script>

<template>
    <div class="flex h-2 gap-[3px]" v-if="selectedPet">
        <Button v-if="!isUpdating[data]" variant="summaryCta" size="xxs" @click="startUpdating"
            :aria-label="`Update ${data}`">
            <Edit2 v-if="data in selectedPet" :size="16" />
            <span v-else>Add {{ data }}</span>
        </Button>
        <form @submit.prevent="handleSubmit(data)" v-else aria-label="update {{data}}" class="flex gap-0.5"
            ref="updateForm">
            <input v-model="formData.data" :type="data === 'weight' ? 'number' : 'text'" :id="`pet-${data}`">
            <div class="input-container" v-if="data === 'weight'">
                <select v-model="formData.unit">
                    <option>kg</option>
                    <option>g</option>
                </select>
            </div>
        </form>
        <Button v-if="isUpdating[data]" size="xs" variant="ghost" @click="isUpdating[data] = false">
            <X :size="18" :color="'var(--color-brand-light)'" />
        </Button>
    </div>
</template>

<style scoped>
input,
select {
    border-radius: 0.5rem;
    padding: 5px 0.5rem;
}

input {
    font-weight: 500;
}

select {
    width: 3rem;
}
</style>