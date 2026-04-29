<script setup lang="ts">
import { CalendarCheck, CalendarClock } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Input from '../../../components/Input.vue';
import { tsToDate } from '../../../utils';
import { usePets } from '../../pets/composables/usePets';
import { vaccineFields } from '../config';
import type { VaccineExtended } from '../types';
import { getVaccineTypes } from '../utils';

const { types, givenDate, dueDate, vet, notes } = vaccineFields;
const { pets, vets } = usePets();
const { t } = useI18n();

const props = defineProps<{ vaccine: VaccineExtended }>();

const pet = computed(() => pets.value.find(p => p.id === props.vaccine.petId));
const vaccineTypes = computed(() => {
    if (!pet.value) return null;
    const vaccines = getVaccineTypes(pet.value.species);
    return vaccines?.filter(v => props.vaccine.types.includes(v.id));
});

const assignedVet = computed(() => {
    if (!vets.value?.length) return null;
    return vets.value?.find(vet => vet.id === props.vaccine.vet)?.name ?? props.vaccine.vet
});
</script>

<template>
    <div>
        <fieldset class="default-padding flex-wrap">
            <legend>{{ t(types.label) }}</legend>
            <Input v-for="option in vaccineTypes" :key="option.id" :label="option.label" :type="types.type"
                :model-value="true" checked />
        </fieldset>

        <div class="default-padding flex flex-col gap-1">
            <Input v-if="vaccine.givenAt" :type="givenDate.type" :model-value="tsToDate(vaccine.givenAt, 'input')"
                :label="t(givenDate.label)" readonly>
                <template #addon>
                    <CalendarCheck />
                </template>
            </Input>
            <Input v-if="vaccine.dueOn" :type="dueDate.type" :model-value="tsToDate(vaccine.dueOn, 'input')"
                :label="t(dueDate.label)" readonly>
                <template #addon>
                    <CalendarClock />
                </template>
            </Input>
            <Input v-if="assignedVet" :model-value="assignedVet" :label="t(vet.label)" readonly />
            <label :for="notes.id">
                <p>{{ t(notes.label) }}</p>
                <textarea :id="notes.id" readonly>{{ vaccine.notes || "no notes" }}
    </textarea>
            </label>
        </div>
    </div>
</template>