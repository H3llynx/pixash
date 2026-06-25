<script setup lang="ts">
import { BugOff, MapPinned, Stethoscope, Syringe, Weight, X } from '@lucide/vue';
import { computed, ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Loading from '../../../../components/loading/Loading.vue';
import { useDialog } from '../../../../composables/useDialog.ts';
import { useToast } from '../../../../composables/useToast.ts';
import { usePets } from '../../../pets/composables/usePets.ts';
import { prefersKg } from '../../../pets/utils.ts';
import { useEvents } from '../../composables/useEvents.ts';
import type { LogExtended, PetEvent, VaccineExtended, VisitExtended } from '../../types.ts';
import { showAntiparasites } from '../../utils.ts';
import TypeTag from './TypeTag.vue';

const { careLoading, vets, pets, selectedPet, deleteSelectedVaccine, deleteSelectedVisit, deleteSelectedLog, careError } = usePets();
const { locale, t } = useI18n();
const { useEventData, selectedEvent } = useEvents();
const { open } = useDialog();
const { show } = useToast();
const loading = ref<boolean>(false);

const props = defineProps<{ event: PetEvent }>();
const { vet, title } = useEventData(toRef(props, "event"));
const date = computed(() => {
    if (props.event.givenAt) return props.event.givenAt;
    else return props.event.ts
});
const weight = computed(() => {
    const pet = pets.value.find(pet => pet.id === props.event.petId);
    if (!pet || !props.event.weight) return null
    else {
        const unit = prefersKg(pet) ? "kg" : "g";
        const unitFactor = prefersKg(pet) ? 1 / 1000 : 1;
        return `${props.event.weight * unitFactor} ${unit}`
    };
});

const handleDelete = () => {
    const pet = selectedPet.value;
    if (!pet) return;
    open({
        title: t("dialog.deleteRecord.title", { title: title.value }),
        message: t("dialog.deleteRecord.message", { name: pet.name, title: title.value }),
        isDelete: true,
        onConfirm: async () => {
            loading.value = true;
            try {
                loading.value = true;
                if (props.event.eventType === "vaccine") await deleteSelectedVaccine(props.event as VaccineExtended, pet.id);
                else if (props.event.eventType === "visit") await deleteSelectedVisit(props.event as VisitExtended, pet.id);
                else await deleteSelectedLog(props.event as LogExtended, pet.id)
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.eventDeleted", { name: pet.name, title: title.value }),
                });
            } catch (error) {
                show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
            } finally { loading.value = false; }
        }
    });
}
</script>

<template>
    <div :class="{
        'animate-pulse': careLoading && selectedEvent?.id === event.id,
        'rounded-xl border border-border gap-0.5 flex justify-between items-start text-left p-0.25 w-full md:max-w-md bg-bg-3': true
    }">
        <div class="flex gap-0.5 w-full min-w-0 h-full px-0.5 py-1">
            <Syringe v-if="event.eventType === 'vaccine'" class="card-icon" :size="20" />
            <Stethoscope v-if="event.eventType === 'visit'" class="card-icon" :size="20" />
            <template v-else-if="event.eventType === 'log'">
                <BugOff v-if="event.type === 'antiparasite'" class="card-icon" :size="20" />
                <Weight v-if="event.type === 'weight'" class="card-icon" :size="20" />
            </template>
            <div class="flex flex-col justify-content w-full">
                <div class="flex gap-0.5 flex-1">
                    <div class="w-1/2">
                        <p class="text-text-secondary text-xs">
                            {{ date.toDate().toLocaleDateString(locale, {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            }) }}</p>
                        <h4 class="font-medium text-sm">{{ title }}</h4>
                        <p class="text-text-secondary text-xs" v-if="event.treated">{{ showAntiparasites(event.treated,
                            locale,
                            t) }}</p>
                    </div>
                    <div class="flex flex-col justify-content gap-1 flex-1 items-end">
                        <TypeTag :event="event" class="ml-auto" />
                        <span v-if="event.notes" class="text-text-secondary text-xs italic">{{ event.notes }}</span>
                        <div v-if="event.weight" class="flex gap-0.5 items-center">
                            <Weight :size="20" />
                            <span class="text-xl">{{ weight }}</span>
                        </div>
                    </div>
                </div>
                <p v-if="event.vet" class="mt-auto pt-0.5 text-xs text-brand-light flex items-center gap-[5px]">
                    <Loading v-if="!vets.length" class="my-0.5" />
                    <MapPinned v-else :size="16" /> {{ vet }}
                </p>
            </div>
        </div>
        <Button variant="ghost" size="xxs" class="mb-auto" :aria-label="t('common.button.deleteRecord')"
            @click="handleDelete">
            <X :size="20" />
        </Button>
    </div>
</template>