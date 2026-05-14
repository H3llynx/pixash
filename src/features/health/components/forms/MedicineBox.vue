<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Input from '../../../../components/Input.vue';
import { medFields } from '../../config';
import type { Medicine } from '../../types';

const { title, name, instructions, frequency, endDate } = medFields;
const { t } = useI18n();
const error = ref<boolean>(false);

defineProps<{ index: number }>();

const medData = defineModel<Medicine>();
</script>

<template>
    <div class="card bg-bg-rgba" v-if="medData">
        <h3>{{ t(title, { index: index }) }}</h3>
        <Input v-model="medData.name" :id="`med-name-${index}`" :label="t(name.label)" required />
        <Input v-model="medData.instructions" :id="`med-instructions-${index}`" :label="t(instructions.label)" />
        <fieldset>
            <legend>{{ t(frequency.label) }}</legend>
            <Input v-model="medData.frequency" v-for="option in frequency.options" :name="`${option.id}-${index}`"
                :value="option.id" :key="`${option.id}-${index}`" :label="t(option.label)" :type="frequency.type"
                @input="error = false" />
            <p v-if="error" class="text-sm w-full text-error pb-0.5">{{
                t("health.medicine.validationFrequency") }}</p>
        </fieldset>
        <Input v-model="medData.endDate" :id="`med-end-date-${index}`" :type="endDate.type" :label="t(endDate.label)"
            required />
    </div>
</template>

<style scoped>
:deep(label:has(input[type="radio"])) p {
    display: flex;
    height: 3rem;
    padding-inline: 1rem;
    justify-content: center;
    align-items: center;
    border-radius: 0.75rem;
}

:deep(label:has(input[type="radio"]:checked)) p {
    background: var(--color-brand);
    color: var(--color-text-chip);
    font-weight: 500;
}
</style>