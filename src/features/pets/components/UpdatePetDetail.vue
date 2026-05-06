<script setup lang="ts">
import { Edit2, Forward, Plus, Trash2, X } from '@lucide/vue';
import { computed } from '@vue/reactivity';
import { onClickOutside } from '@vueuse/core';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap.js';
import { nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import Input from '../../../components/Input.vue';
import Loading from '../../../components/loading/Loading.vue';
import { resetState } from '../../../utils';
import { useVaccineForm } from '../../health/composables/useVaccineForm';
import type { Log, VaccineExtended } from '../../health/types';
import { usePets } from '../composables/usePets';
import { usePetUpdate } from '../composables/usePetUpdate';
import type { Pet, PetExtended } from '../types';

const { addNewLog, updateSelectedPet, deleteSelectedPetField, selectVaccine, isAddingHealth } = usePets();
const { vaccineLoading } = useVaccineForm();
const { t } = useI18n();

const props = defineProps<{
    pet: PetExtended
    data: "weight" | "microchip" | "nextVaccine"
}>();

const { loading, preferredUnit, formData, getWeightInGrams } = usePetUpdate(props.pet);

const isUpdating = defineModel();
const updateRef = ref<HTMLFormElement>();

onClickOutside(updateRef, () => {
    if (isUpdating.value) {
        isUpdating.value = false;
    }
});

const { activate, deactivate } = useFocusTrap(updateRef, {
    immediate: true,
    allowOutsideClick: true,
});

const hasChanged = computed(() => {
    if (props.data === "weight") {
        const grams = getWeightInGrams();
        return grams !== null && props.pet.weight !== grams;
    }
    if (props.data === "microchip") {
        return props.pet.microchip !== formData.data;
    }
    return false;
});

const startUpdating = () => {
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

const handleSubmit = async (field: "weight" | "microchip") => {
    if (!formData.data) return;
    loading.value = true;
    let update = {};
    if (field === "weight") {
        const grams = getWeightInGrams();
        if (grams === null) return;
        update = { weight: grams };
        const log: Log = {
            type: "weight",
            weight: grams,
        };
        await addNewLog(log, props.pet.id);
    } else {
        const microchip = formData.data;
        if (props.pet.microchip === microchip) return;
        update = { microchipped: true, microchip: microchip };
        await updateSelectedPet(props.pet, update);
    }
    isUpdating.value = false;
    loading.value = false;
};

const handleDelete = async () => {
    await deleteSelectedPetField(props.pet, props.data as keyof Pet);
    if (props.data === "microchip") await updateSelectedPet(props.pet, { microchipped: false });
    isUpdating.value = false;
};

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

watch(() => isUpdating.value, async (updating) => {
    if (updating) {
        await nextTick();
        activate();
    } else deactivate();
});
</script>

<template>
    <Loading v-if="loading || (data === 'nextVaccine' && vaccineLoading)" class="ml-auto" />
    <div v-else class="flex h-2 gap-[3px]">
        <Button v-if="!isUpdating || data === 'nextVaccine'" variant="summaryCta" size="xxs" @click="startUpdating"
            :aria-label="t('pet.profile.edit.' + data)">
            <Edit2 v-if="pet[data]" :size="16" />
            <Plus v-else :size="18" />
        </Button>
        <form ref="updateRef" v-else @submit.prevent="handleSubmit(data)" class="mini-form flex gap-[3px]">
            <Input v-model="formData.data" :type="data === 'weight' ? 'number' : 'text'" :id="`pet-${data}`"
                :step="data === 'weight' ? (formData.unit === 'kg' ? '0.001' : '1') : 'any'" ref="weightInputRef"
                class="text-base" />
            <div class="input-container" v-if="data === 'weight'">
                <select v-model="formData.unit" v-if="data === 'weight'">
                    <option>kg</option>
                    <option>g</option>
                </select>
            </div>
            <Button v-if="hasChanged" variant="summaryCta" size="xxs" :aria-label="t('common.button.update')">
                <Forward :size="18" class="rotate-180 text-brand-light" />
            </Button>
            <Button v-else type="button" size="xxs" variant="ghost" @click="isUpdating = false"
                :aria-label="t('common.button.cancel')">
                <X :size="18" color="var(--color-brand-light)" />
            </Button>
            <Button v-if="isUpdating" type="button" size="xxs" variant="ghost" @click="handleDelete">
                <Trash2 :size="18" color="var(--color-brand-light)" />
            </Button>
        </form>
    </div>
</template>

<style scoped>
select {
    border-radius: 0.5rem;
    padding: 3px 0.5rem;
    width: 3rem;
}

:deep(input) {
    border-radius: 0.75rem;
    padding-block: 4px;
    padding-inline: 10px;
}
</style>