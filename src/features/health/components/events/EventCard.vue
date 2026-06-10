<script setup lang="ts">
import { Check, MapPinned, Stethoscope, Syringe } from '@lucide/vue';
import { computed, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Loading from '../../../../components/loading/Loading.vue';
import { useToast } from '../../../../composables/useToast';
import { todayAsInput, tsToDate } from '../../../../utils';
import PetIndicator from '../../../pets/components/PetIndicator.vue';
import { usePets } from '../../../pets/composables/usePets';
import type { LogExtended } from '../../../pets/types';
import { useEvents } from '../../composables/useEvents';
import type { STAGE } from '../../config';
import type { AntiparasiteLogExtended, AntiparasiteTypes, PetEvent, VaccineExtended, VaccineRecord, VaccineTypes, VisitExtended } from '../../types';
import DateTag from './DateTag.vue';

const { logs, vaccines, vetVisits, selectVaccine, selectVisit, selectLog, vets, updateSelectedVaccine, updateSelectedLog, addNewVaccine, addNewLog, healthError } = usePets();
const { locale, t } = useI18n();
const { useEventData } = useEvents();
const { show } = useToast();

const props = defineProps<{ event: PetEvent }>();
const { pet, vet, title } = useEventData(toRef(props, "event"));

const date = computed(() => props.event.dueOn ?? props.event.date ?? props.event.ts);

const handleClick = (event: PetEvent) => {
    if (event.eventType === "vaccine") {
        const vaccine = vaccines.value.find(v => v.id === event.id) as VaccineExtended;
        selectVaccine(vaccine);
    } else if (event.eventType === "visit") {
        const visit = vetVisits.value.find(v => v.id === event.id) as VisitExtended;
        selectVisit(visit);
    } else if (event.type === "antiparasite") {
        const log = logs.value.find(l => l.id === event.id) as AntiparasiteLogExtended;
        selectLog(log, "antiparasitic");
    } else return;
}

const markAsDone = async (event: PetEvent) => {
    if (!pet.value) return;
    const today = todayAsInput();
    try {
        if (event.eventType === "vaccine") {
            const baseData: VaccineRecord = {
                types: event.types as VaccineTypes["id"][],
                stage: event.stage as typeof STAGE[number]["id"],
                vet: event.vet,
                notes: event.notes,
            };
            if (event.givenAt && event.dueOn) {
                const newData = {
                    ...baseData,
                    givenAt: tsToDate(event.givenAt, "input") as string,
                    dueOn: ""
                };
                await updateSelectedVaccine(event as VaccineExtended, pet.value.id, newData);
                await addNewVaccine({ ...baseData, givenAt: today }, pet.value.id)
            } else await updateSelectedVaccine(event as VaccineExtended, pet.value.id, { ...baseData, givenAt: today, dueOn: "" }
            );
        }
        if (event.eventType === "log" && event.type === "antiparasite") {
            const baseData = {
                treated: event.treated as AntiparasiteTypes["id"][],
                notes: event.notes,
                type: event.type,
            };
            if (event.givenAt && event.dueOn) {
                const newData = {
                    ...baseData,
                    givenAt: tsToDate(event.givenAt, "input") as string,
                    dueOn: ""
                };
                await updateSelectedLog(event as LogExtended, pet.value.id, newData);
                await addNewLog({ ...baseData, givenAt: today }, pet.value.id)
            };
        }
        show({ type: "success", title: t("toast.success.title.generic"), message: t("toast.success.message.markedDone") });
    } catch {
        show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
    }
};

</script>
<template>
    <div tabindex="0" role="button"
        class="card hover-gradient cursor-pointer flex-row p-1 w-full md:max-w-md border border-border gap-1.5 justify-between"
        @click="handleClick(event)" @keydown.enter="handleClick(event)">
        <div class="flex gap-0.5 w-full min-w-0 h-full">
            <Syringe v-if="event.eventType === 'vaccine'" class="card-icon" :size="20" />
            <Stethoscope v-else class="card-icon" :size="20" />
            <div class="flex-1 min-w-0 flex flex-col">
                <div class="flex gap-0.5 items-start">
                    <h4>{{ title }}</h4>
                    <DateTag :date="date" class="ml-auto"
                        :withMissed="event.eventType === 'vaccine' || event.type === 'antiparasite'" />
                </div>
                <div>
                    <p class="text-text-secondary mb-0.5">
                        {{ event.ts.toDate().toLocaleDateString(locale, {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }) }}</p>
                    <Button
                        v-if="event.eventType === 'vaccine' || event.eventType === 'log' && event.type === 'antiparasite'"
                        size="xxs" variant="tertiary" @click="markAsDone(event)">
                        <Check :size="16" />{{ t("common.button.markDone") }}
                    </Button>
                </div>
                <p v-if="event.vet" class="mt-auto pt-1 text-xs text-brand-light flex items-center gap-[5px]">
                    <Loading v-if="!vets.length" />
                    <MapPinned v-else :size="16" /> {{ vet }}
                </p>
            </div>
        </div>
        <PetIndicator :pet="pet!" />
    </div>
</template>

<style scoped>
@media (width >=48rem) {

    h4,
    p {
        font-size: clamp(0.85rem, 0.5vw, 1rem);
    }
}
</style>