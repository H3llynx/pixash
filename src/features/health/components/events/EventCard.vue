<script setup lang="ts">
import { Check, MapPinned, Stethoscope, Syringe } from '@lucide/vue';
import { toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import EventCardSkeleton from '../../../../components/loading/EventCardSkeleton.vue';
import Loading from '../../../../components/loading/Loading.vue';
import { useToast } from '../../../../composables/useToast';
import { tsToDate } from '../../../../utils';
import PetIndicator from '../../../pets/components/PetIndicator.vue';
import { usePets } from '../../../pets/composables/usePets';
import { useEvents } from '../../composables/useEvents';
import type { STAGE } from '../../config';
import type { AntiparasiteTypes, LogExtended, PetEvent, VaccineExtended, VaccineRecord, VaccineTypes, VisitExtended } from '../../types';
import DateTag from './DateTag.vue';

const { vaccines, vetVisits, selectVaccine, selectVisit, vets, healthLoading, updateSelectedVaccine, updateSelectedLog, addNewVaccine, addNewLog, healthError } = usePets();
const { locale, t } = useI18n();
const { useEventData } = useEvents();
const { show } = useToast();

const props = defineProps<{ event: PetEvent }>();
const { pet, vet, title } = useEventData(toRef(props, "event"));

const handleClick = (event: PetEvent) => {
    if (event.eventType === "vaccine") {
        const vaccine = vaccines.value.find(v => v.id === event.id) as VaccineExtended;
        selectVaccine(vaccine);
    } else {
        const visit = vetVisits.value.find(v => v.id === event.id) as VisitExtended;
        selectVisit(visit);
    }
}

const markAsDone = async (event: PetEvent) => {
    if (!pet.value) return;
    const today = new Date().toISOString().slice(0, 10);
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
    <EventCardSkeleton v-if="healthLoading" />
    <div tabindex="0"
        class="card cursor-pointer flex p-1 w-full md:max-w-md rounded-xl border border-border gap-1.5 justify-between items-start text-left"
        v-else @click="handleClick(event)" :class="{ 'opacity-50': tsToDate(event.ts, 'isPast') }">
        <div class="flex gap-0.5 w-full min-w-0 h-full">
            <Syringe v-if="event.eventType === 'vaccine'" class="card-icon" :size="20" />
            <Stethoscope v-else class="card-icon" :size="20" />
            <div class="flex-1 min-w-0 flex flex-col">
                <div class="flex gap-0.5 items-start">
                    <h4>{{ title }}</h4>
                    <DateTag :event="event" class="ml-auto" />
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
                        size="xs" variant="ghost" class="border border-border mb-1" @click="markAsDone(event)">
                        <Check :size="20" />{{ t("common.button.markDone") }}
                    </Button>
                </div>
                <p v-if="event.vet" class="mt-auto text-xs text-brand-light flex items-center gap-[5px]">
                    <Loading v-if="!vets.length" />
                    <MapPinned v-else :size="16" /> {{ vet }}
                </p>
            </div>
        </div>
        <PetIndicator :pet="pet!" />
    </div>
</template>

<style scoped>
.card {
    background: var(--color-bg-2);
    position: relative;
    overflow: hidden;
    transition: 1s ease;

    &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        inset: 0;
        background-image: var(--background-image-card);
        background-size: 150% 100%;
        opacity: 0;
        z-index: -1;
        transition: 1s ease;
    }
}

@media (width >=48rem) {

    h4,
    p {
        font-size: clamp(0.85rem, 0.5vw, 1rem);
    }
}


@media (hover: hover) and (pointer: fine) {
    .card:hover {
        color: var(--color-brand);
        border-color: var(--color-brand);
        transform: scale(1.02);

        &::before {
            animation: move-overlay 10s ease-out infinite;
            opacity: 1;
        }
    }
}
</style>