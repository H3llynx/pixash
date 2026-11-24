<script setup lang="ts">
import { CalendarClock } from '@lucide/vue';
import { ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import FreeModal from '../../../../components/FreeModal.vue';
import Input from '../../../../components/Input.vue';
import LoadingPet from '../../../../components/loading/LoadingPet.vue';
import { useToast } from '../../../../composables/useToast.ts';
import { todayAsInput, tsToDate } from '../../../../utils.ts';
import { usePets } from '../../../pets/composables/usePets.ts';
import { useEvents } from '../../composables/useEvents.ts';
import type { STAGE } from '../../config.ts';
import type { AntiparasiteTypes, LogExtended, PetEvent, VaccineExtended, VaccineRecord, VaccineTypes } from '../../types.ts';

const { selectVaccine, selectLog, updateSelectedVaccine, updateSelectedLog, addNewVaccine, addNewLog, careError } = usePets();
const { show } = useToast();
const { t } = useI18n();
const { nextDueModalOpen, useEventData } = useEvents();

const props = defineProps<{ event: PetEvent }>();
const { pet } = useEventData(toRef(props, "event"));

const nextDueInput = ref<boolean>(false);
const nextDueDate = ref<string>("");
const loading = ref<boolean>(false);

const markAsDone = async (event: PetEvent) => {
    if (!pet.value) return;
    const today = todayAsInput();
    loading.value = true;
    try {
        if (event.eventType === "vaccine") {
            const baseData: VaccineRecord = {
                types: event.types as VaccineTypes["id"][],
                stage: event.stage as typeof STAGE[number]["id"],
                vet: event.vet,
                notes: event.notes,
            };
            if (event.givenAt && event.dueOn) {
                await updateSelectedVaccine(event as VaccineExtended, {
                    ...baseData,
                    givenAt: tsToDate(event.givenAt, "input") as string,
                    dueOn: ""
                });
                await addNewVaccine({ ...baseData, givenAt: today, dueOn: nextDueDate.value }, pet.value.id);
            } else {
                await updateSelectedVaccine(event as VaccineExtended, {
                    ...baseData,
                    givenAt: today,
                    dueOn: nextDueDate.value
                });
            }
            selectVaccine(null);
        };
        if (event.eventType === "log" && event.type === "antiparasite") {
            const baseData = {
                treated: event.treated as AntiparasiteTypes["id"][],
                notes: event.notes,
                type: event.type,
            };
            if (event.givenAt && event.dueOn) {
                await updateSelectedLog(event as LogExtended, {
                    ...baseData,
                    givenAt: tsToDate(event.givenAt, "input") as string,
                    dueOn: ""
                });
                await addNewLog({ ...baseData, givenAt: today, dueOn: nextDueDate.value }, pet.value.id);
            } else {
                await updateSelectedLog(event as LogExtended, {
                    ...baseData,
                    givenAt: today,
                    dueOn: nextDueDate.value
                });
            }
            selectLog(null);
        };
        show({ type: "success", title: t("toast.success.title.generic"), message: t("toast.success.message.markedDone") });
    } catch {
        show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
    } finally {
        nextDueModalOpen.value = false;
        loading.value = false;
    }
};

const cancelMarkDone = () => {
    selectVaccine(null);
    selectLog(null)
    nextDueModalOpen.value = false;
};
</script>

<template>
    <FreeModal v-model="nextDueModalOpen" class="relative">
        <LoadingPet v-if="loading" />
        <template v-else>
            <h3 class="font-title">{{ t("common.text.askingNextDue") }}</h3>
            <Button v-if="!nextDueInput" @click="nextDueInput = true">{{ t("common.text.yes") }}</Button>
            <Button v-if="!nextDueDate" variant="secondary" @click="markAsDone(event)">{{ t("common.text.noNeed")
                }}</Button>
            <template v-if="nextDueInput">
                <Input v-model="nextDueDate" type="date" :min="todayAsInput()">
                    <template #addon>
                        <CalendarClock v-if="!nextDueDate" class="mr-0.5" color="var(--color-border)" />
                        <Button v-else variant="ghost" size="xs" @click="nextDueDate = ''">{{
                            t("common.button.clear") }}</Button>
                    </template>
                </Input>
                <Button v-if="nextDueDate" @click="markAsDone(event)">{{ t("common.button.confirm") }}</Button>
            </template>
            <Button variant="ghost" @click="cancelMarkDone">{{ t("common.button.cancel") }}</Button>
        </template>
    </FreeModal>
</template>