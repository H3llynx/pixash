import { computed, nextTick, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "../../../composables/useToast";
import { tsFromInput, tsToDate } from "../../../utils";
import { usePets } from "../../pets/composables/usePets";
import type { PetExtended } from "../../pets/types";
import type { Log, MedicationLogExtended, MedicineDb, MissedDoseRecord, TreatmentExtended } from "../types";
import { checkOverlapsMonth, getDailyDose, getIntervalHours, getTreatmentColor } from "../utils";
import { useEvents } from "./useEvents";

const editedLog = ref<MedicationLogExtended | null>(null);
const editedTreatment = ref<TreatmentExtended | null>(null);
const missedDate = ref<Date | null>(null);
const logMedication = ref<MedicineDb | null>(null);
const savingLogIds = reactive(new Set<string>());
const savingNewLog = ref<boolean>(false);

const isModalOpen = ref<boolean>(false);
const modalState = ref<"add" | "edit" | null>(null);

export const useTreatments = () => {
    const { treatments, addNewLog, updateSelectedLog, deleteSelectedLog, careError } = usePets();
    const { currentMonth } = useEvents();
    const { show } = useToast();
    const { t } = useI18n();

    const DOSE_WINDOW = { startHour: 8, endHour: 21 };

    const byStartThenEndDesc = (a: TreatmentExtended, b: TreatmentExtended) => {
        const startDiff = b.startDate!.seconds - a.startDate!.seconds;
        if (startDiff !== 0) return startDiff;
        if (!a.endDate && !b.endDate) return 0;
        if (!a.endDate) return -1;
        if (!b.endDate) return 1;
        return b.endDate.seconds - a.endDate.seconds;
    };

    const isMedicationEnded = (medication: MedicineDb): boolean =>
        !!tsToDate(medication.endDate, "isPast");

    const treatmentsThisMonth = computed(() => {
        const now = new Date();
        return treatments.value
            .filter(t => {
                const overlapsMonth = checkOverlapsMonth(
                    t.startDate,
                    t.endDate!,
                    currentMonth.value
                );
                return overlapsMonth;
            })
            .sort(byStartThenEndDesc)
            .map((t, index) => ({
                ...t,
                color: getTreatmentColor(index),
                isActive: t.startDate.toDate() <= now && (!t.endDate || !tsToDate(t.endDate, "isPast")),
                isPast: !!t.endDate && tsToDate(t.endDate, "isPast")
            }))
    });

    const scheduledTreatments = computed(() => treatments.value
        .filter(t => t.startDate.toDate() > new Date())
        .sort(byStartThenEndDesc)
    );

    const activeTreatments = computed(() => {
        const now = new Date();
        return treatments.value
            .filter(t => t.startDate.toDate() <= now && (!t.endDate || !tsToDate(t.endDate, "isPast")))
            .sort(byStartThenEndDesc)
    });

    const getTodayLoggedList = (
        pet: PetExtended,
        treatment: TreatmentExtended,
        medication: MedicineDb
    ): MedicationLogExtended[] => {
        const today = new Date().toLocaleDateString();
        return pet.logs.filter(log =>
            log.type === "medication" &&
            log.treatmentId === treatment.id &&
            log.medicineId === medication.id &&
            log.givenAt &&
            log.givenAt.toDate().toLocaleDateString() === today
        ) as MedicationLogExtended[];
    };

    const getTotalLogs = (
        pet: PetExtended,
        treatment: TreatmentExtended,
        medication: MedicineDb
    ): MedicationLogExtended[] => {
        const logs = pet.logs.filter(log =>
            log.type === "medication" &&
            log.treatmentId === treatment.id &&
            log.medicineId === medication.id
        ) as MedicationLogExtended[];
        return logs.sort((a, b) => b.givenAt.toDate().getTime() - a.givenAt.toDate().getTime());
    };

    const getLatestLog = (
        pet: PetExtended,
        treatment: TreatmentExtended,
        medication: MedicineDb
    ): MedicationLogExtended | undefined =>
        getTotalLogs(pet, treatment, medication)[0];

    const getDailyDosesToLog = (
        pet: PetExtended,
        treatment: TreatmentExtended,
        medication: MedicineDb
    ): number => {
        if (isMedicationEnded(medication)) return 0;
        const loggedList = getTodayLoggedList(pet, treatment, medication) || [];
        const dailyDose = getDailyDose(medication.frequency);
        return dailyDose !== undefined ? dailyDose - loggedList.length : 1;
    };

    const getDailyMissedDoses = (
        pet: PetExtended,
        treatment: TreatmentExtended,
        medication: MedicineDb
    ): number => {
        if (isMedicationEnded(medication)) return 0;
        const latestLog = getLatestLog(pet, treatment, medication);
        const intervalHours = getIntervalHours(medication.frequency);
        const dailyDose = getDailyDose(medication.frequency);
        if (intervalHours === undefined) return 0;
        const intervalMs = intervalHours * 3600000

        if (!latestLog && (dailyDose === undefined || dailyDose === 1)) {
            const firstDayThreshold = treatment.startDate.toDate();
            firstDayThreshold.setHours(DOSE_WINDOW.endHour, 0, 0, 0);
            return Date.now() >= firstDayThreshold.getTime() ? 1 : 0;
        };

        if (dailyDose === undefined || dailyDose === 1) {
            return Date.now() >= latestLog!.givenAt.toMillis() + intervalMs ? 1 : 0;
        };

        const loggedToday = getTodayLoggedList(pet, treatment, medication);
        if (loggedToday.length >= dailyDose) return 0;
        const referenceTimestamp = loggedToday.length === 0
            ? Math.max(new Date().setHours(DOSE_WINDOW.startHour, 0, 0, 0) + intervalMs, treatment.startDate.toMillis())
            : latestLog!.givenAt.toMillis() + intervalMs;
        return Date.now() >= referenceTimestamp ? 1 : 0;
    };

    const getLoggedListForDate = (
        pet: PetExtended,
        treatment: TreatmentExtended,
        medication: MedicineDb,
        date: Date
    ): MedicationLogExtended[] => {
        const dateString = date.toLocaleDateString();
        return pet.logs.filter(log =>
            log.type === "medication" &&
            log.treatmentId === treatment.id &&
            log.medicineId === medication.id &&
            log.givenAt &&
            log.givenAt.toDate().toLocaleDateString() === dateString
        ) as MedicationLogExtended[];
    };

    const getMissedDosesHistory = (
        pet: PetExtended,
        treatment: TreatmentExtended,
        medication: MedicineDb
    ): MissedDoseRecord[] => {
        const dailyDose = getDailyDose(medication.frequency);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const scanStart = treatment.startDate.toDate();
        scanStart.setHours(0, 0, 0, 0);
        let scanEnd = today;

        if (medication.endDate) {
            const medEnded = medication.endDate.toDate();
            medEnded.setHours(0, 0, 0, 0);
            const dayAfterMedEnded = new Date(medEnded);
            dayAfterMedEnded.setDate(dayAfterMedEnded.getDate() + 1);
            if (dayAfterMedEnded < scanEnd) scanEnd = dayAfterMedEnded;
        }

        if (dailyDose !== undefined) {
            const missedDoses: MissedDoseRecord[] = [];
            const cursor = new Date(scanStart);
            while (cursor < scanEnd) {
                const given = getLoggedListForDate(pet, treatment, medication, cursor).length;
                const count = dailyDose - given;
                if (count > 0) missedDoses.push({ date: new Date(cursor), count, medication });
                cursor.setDate(cursor.getDate() + 1);
            }
            return missedDoses;
        }

        const intervalHours = getIntervalHours(medication.frequency);
        if (intervalHours === undefined) return [];

        const expectedSlots: Date[] = [];
        const cursor = new Date(scanStart);
        while (cursor < scanEnd) {
            expectedSlots.push(new Date(cursor));
            cursor.setTime(cursor.getTime() + intervalHours * 3_600_000);
        }
        const logDates = getTotalLogs(pet, treatment, medication)
            .map(l => l.givenAt.toDate())
            .filter(d => d < scanEnd)
            .sort((a, b) => a.getTime() - b.getTime());

        const uncovered = [...expectedSlots];
        for (const logDate of logDates) {
            let bestIndex = -1;
            let bestDiff = Infinity;
            uncovered.forEach((slot, i) => {
                const diff = Math.abs(slot.getTime() - logDate.getTime());
                if (diff < bestDiff) { bestDiff = diff; bestIndex = i; }
            });
            if (bestIndex !== -1) uncovered.splice(bestIndex, 1);
        }
        return uncovered.map(date => ({ date, count: 1, medication }));
    };

    const openModal = async (
        action: "edit" | "add",
        treatment: TreatmentExtended,
        medication: MedicineDb,
        log?: MedicationLogExtended,
        date?: Date
    ) => {
        modalState.value = action;
        editedTreatment.value = treatment;
        logMedication.value = medication;
        if (action === "edit" && log) editedLog.value = log;
        if (action === "add" && date) missedDate.value = date;
        await nextTick();
        isModalOpen.value = true;
    };

    const closeModal = () => {
        modalState.value = null;
        logMedication.value = null;
        editedTreatment.value = null;
        editedLog.value = null;
        missedDate.value = null;
        isModalOpen.value = false;
    };

    const editLogTime = async (log: MedicationLogExtended, updatedLog: Log) => {
        savingLogIds.add(log.id);
        try {
            await updateSelectedLog(log, updatedLog);
        } catch (e) {
            show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
        } finally {
            savingLogIds.delete(log.id);
        }
    }

    const deleteDose = async (log: MedicationLogExtended) => {
        savingLogIds.add(log.id);
        try {
            await deleteSelectedLog(log);
        } catch (e) {
            show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
        } finally {
            savingLogIds.delete(log.id);
        }
    };

    const logDose = async (treatment: TreatmentExtended, medication: MedicineDb, date: string) => {
        savingNewLog.value = true;
        const log: Log = {
            type: "medication",
            treatmentId: treatment.id,
            medicineId: medication.id,
            givenAt: tsFromInput(date)
        };
        try {
            await addNewLog(log, treatment.petId);
        } catch (e) {
            show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
        } finally {
            savingNewLog.value = false;
        }
    };

    return {
        openModal,
        closeModal,
        isModalOpen,
        modalState,
        editedLog,
        editedTreatment,
        logMedication,
        savingLogIds,
        savingNewLog,
        missedDate,
        deleteDose,
        logDose,
        editLogTime,
        byStartThenEndDesc,
        isMedicationEnded,
        treatmentsThisMonth,
        activeTreatments,
        scheduledTreatments,
        getTodayLoggedList,
        getTotalLogs,
        getDailyDosesToLog,
        getDailyMissedDoses,
        getMissedDosesHistory
    };

}