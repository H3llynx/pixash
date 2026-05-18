<script setup lang="ts">
import { inject, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Input from '../../../../components/Input.vue';
import Selector from '../../../../components/Selector.vue';
import Toggle from '../../../../components/Toggle.vue';
import { useTreatmentForm } from '../../composables/useTreatmentForm';
import { medFields } from '../../config';
import type { Medicine } from '../../types';

const { title, name, instructions, frequency, noEnd, endDate } = medFields;
const { formData } = useTreatmentForm();
const { t } = useI18n();
const readonly = inject("readonly", ref(false));
const error = ref<boolean>(false);

defineProps<{ index: number }>();

const medData = defineModel<Medicine>();

watch(() => medData.value?.noEnd, (noEnd) => {
    if (medData.value && noEnd) {
        medData.value.endDate = "";
    };
});
</script>

<template>
    <div class="p-1 rounded-xl border border-border bg-bg-rgba" v-if="medData">
        <div class="flex flex-col gap-0.5 mb-0.5">
            <h3>{{ t(title, { index: index }) }}</h3>
            <Input v-model="medData.name" :id="`med-name-${medData.id}`" :label="t(name.label)" required />
            <Input v-model="medData.instructions" :id="`med-instructions-${medData.id}`"
                :label="t(instructions.label)" />
        </div>
        <Selector :legend="t(frequency.label)" class="px-0">
            <Input v-model="medData.frequency" v-for="option in frequency.options" :name="`${option.id}-${medData.id}`"
                :value="option.id" :key="`${option.id}-${medData.id}`" :label="t(option.label)" :type="frequency.type"
                @input="error = false" />
            <p v-if="error" class="text-sm w-full text-error pb-0.5">{{
                t("health.medicine.validationFrequency") }}</p>
        </Selector>
        <div class="flex flex-col">
            <Toggle v-if="!readonly" v-model="medData.noEnd" :label="t(noEnd.label)" :id="`${noEnd.id}-${medData.id}`"
                class="text-sm ml-auto gap-1 italic font-medium text-brand" />
            <Input v-if="!medData.noEnd" v-model="medData.endDate" :id="`med-end-date-${medData.id}`"
                :type="endDate.type" :label="t(endDate.label)" :min="formData.startDate" required />
        </div>
    </div>
</template>

<style scoped>
:deep(legend) {
    font-size: 14px;
}

:deep(label:has(input[type="radio"])) p {
    display: flex;
    height: 3rem;
    padding-inline: 1rem;
    justify-content: center;
    align-items: center;
    border-radius: 0.75rem;
    font-size: 14px;
}

:deep(label:has(input[type="radio"]:checked)) p {
    background: var(--color-brand);
    color: var(--color-text-chip);
    font-weight: 500;
}
</style>