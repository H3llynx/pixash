<script setup lang="ts">
import { CalendarClock } from '@lucide/vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import FreeModal from '../../../../components/FreeModal.vue';
import Input from '../../../../components/Input.vue';
import LoadingPet from '../../../../components/loading/LoadingPet.vue';
import Selector from '../../../../components/Selector.vue';
import { useMedia } from '../../../../composables/useMedia.ts';
import { useToast } from '../../../../composables/useToast.ts';
import { todayAsInput, tsToDate } from '../../../../utils.ts';
import { usePets } from '../../../pets/composables/usePets.ts';
import { useEvents } from '../../composables/useEvents.ts';
import { DUE_DATE_OPTIONS, type STAGE } from '../../config.ts';
import type { AntiparasiteTypes, LogExtended, VaccineExtended, VaccineRecord, VaccineTypes } from '../../types.ts';

const { selectLog, updateSelectedVaccine, updateSelectedLog, addNewVaccine, addNewLog, careError } = usePets();
const { show } = useToast();
const { t } = useI18n();
const { nextDueModalOpen, nextDueModalEvent } = useEvents();
const { isSm } = useMedia();

const nextDueDate = ref<string>("");
const loading = ref<boolean>(false);

const markAsDone = async () => {
    if (!nextDueModalEvent.value) return;
    const today = todayAsInput();
    loading.value = true;
    try {
        if (nextDueModalEvent.value.eventType === "vaccine") {
            const baseData: VaccineRecord = {
                types: nextDueModalEvent.value.types as VaccineTypes["id"][],
                stage: nextDueModalEvent.value.stage as typeof STAGE[number]["id"],
                vet: nextDueModalEvent.value.vet,
                notes: nextDueModalEvent.value.notes,
            };
            if (nextDueModalEvent.value.givenAt && nextDueModalEvent.value.dueOn) {
                await updateSelectedVaccine(nextDueModalEvent.value as VaccineExtended, {
                    ...baseData,
                    givenAt: tsToDate(nextDueModalEvent.value.givenAt, "input") as string,
                    dueOn: ""
                });
                await addNewVaccine({ ...baseData, givenAt: today, dueOn: nextDueDate.value }, nextDueModalEvent.value.petId);
            } else {
                await updateSelectedVaccine(nextDueModalEvent.value as VaccineExtended, {
                    ...baseData,
                    givenAt: today,
                    dueOn: nextDueDate.value
                });
            }
        };
        if (nextDueModalEvent.value.eventType === "log" && nextDueModalEvent.value.type === "antiparasite") {
            const baseData = {
                treated: nextDueModalEvent.value.treated as AntiparasiteTypes["id"][],
                notes: nextDueModalEvent.value.notes,
                type: nextDueModalEvent.value.type,
            };
            if (nextDueModalEvent.value.givenAt && nextDueModalEvent.value.dueOn) {
                await updateSelectedLog(nextDueModalEvent.value as LogExtended, {
                    ...baseData,
                    givenAt: tsToDate(nextDueModalEvent.value.givenAt, "input") as string,
                    dueOn: ""
                });
                await addNewLog({ ...baseData, givenAt: today, dueOn: nextDueDate.value }, nextDueModalEvent.value.petId);
            } else {
                await updateSelectedLog(nextDueModalEvent.value as LogExtended, {
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
        loading.value = false;
        nextDueModalOpen.value = false;
        nextDueModalEvent.value = null;
    }
};

const cancelMarkDone = () => {
    nextDueModalOpen.value = false;
    nextDueModalEvent.value = null;
};

const getDateFromOption = (option: string) => {
    const now = new Date();
    switch (option) {
        case "week":
            now.setDate(now.getDate() + 7);
            break;
        case "month":
            now.setMonth(now.getMonth() + 1);
            break;
        case "month2":
            now.setMonth(now.getMonth() + 2);
            break;
        case "month3":
            now.setMonth(now.getMonth() + 3);
            break;
        case "month6":
            now.setMonth(now.getMonth() + 6);
            break;
        case "year":
            now.setFullYear(now.getFullYear() + 1);
            break;
        default:
            throw new Error(`Unknown date option: ${option}`);
    }
    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
    ].join("-");
};
</script>

<template>
    <FreeModal v-model="nextDueModalOpen">
        <LoadingPet v-if="loading" />
        <template v-else>
            <div class="flex flex-col sm:flex-row gap-0.5 mb-0.5">
                <div
                    class="m-auto rounded-xl w-4 h-4 sm:w-2.5 sm:h-2.5 bg-accent-rgba text-accent flex shrink-0 justify-center items-center">
                    <CalendarClock :size="isSm ? 22 : 30" />
                </div>
                <div class="text-center sm:text-left">
                    <h3 class="font-title">{{ t("health.nextDueModal.title") }}</h3>
                    <p class="text-sm text-text-secondary">{{ t("health.nextDueModal.text") }}</p>
                </div>
            </div>
            <Input v-model="nextDueDate" type="date" :min="todayAsInput()" :label="t('health.sharedFields.dueDate')">
                <template #addon>
                    <CalendarClock v-if="!nextDueDate" class="mr-0.5" color="var(--color-border)" />
                    <Button v-else variant="ghost" size="xs" @click="nextDueDate = ''">{{
                        t("common.button.clear") }}</Button>
                </template>
            </Input>
            <Selector :legend="t('health.nextDueModal.dateOptions.legend')" class="px-0" legendHidden>
                <Input v-model="nextDueDate"
                    v-for="option in nextDueModalEvent?.eventType === 'vaccine' ? DUE_DATE_OPTIONS.vaccines : DUE_DATE_OPTIONS.antiparasitics"
                    :id="`next-due-${option.id}`" :value="getDateFromOption(option.id)" :key="option.id"
                    :label="t(option.label)" type="radio" name="next-due-date" />
            </Selector>
            <Button v-if="nextDueDate" @click="markAsDone">{{ t("health.cta.saveNextDose")
            }}</Button>
            <div class="flex flex-col sm:flex-row gap-0.5 justify-between text-sm">
                <Button variant="tertiary" class="w-full" @click="markAsDone">{{
                    t("health.nextDueModal.skip")
                }}</Button>
                <Button variant="ghost" class="text-text-secondary" @click="cancelMarkDone">{{
                    t("common.button.cancel")
                    }}</Button>
            </div>
        </template>
    </FreeModal>
</template>

<style scoped>
:deep(label p) {
    text-transform: none;
    color: var(--color-text-softer);
}
</style>