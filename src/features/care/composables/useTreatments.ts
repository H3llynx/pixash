import { computed, ref } from "vue";
import { tsToDate, tsToDay } from "../../../utils";
import { usePets } from "../../pets/composables/usePets";
import type { PetExtended } from "../../pets/types";
import type { MedicationLogExtended, MedicineDb, MissedDoseRecord, TreatmentExtended } from "../types";
import { checkOverlapsMonth, getDailyDose, getIntervalHours, getTreatmentColor } from "../utils";
import { useEvents } from "./useEvents";

const loading = ref<boolean>(false);

export const useTreatments = () => {
    const { treatments } = usePets();
    const { currentMonth } = useEvents();

    const DOSE_WINDOW = { startHour: 8, endHour: 21 };

    const byStartThenEndDesc = (a: TreatmentExtended, b: TreatmentExtended) => {
        const startDiff = b.startDate!.seconds - a.startDate!.seconds;
        if (startDiff !== 0) return startDiff;
        const NO_END = Number.MAX_SAFE_INTEGER;
        const aEnd = a.endDate?.seconds ?? NO_END;
        const bEnd = b.endDate?.seconds ?? NO_END;
        return bEnd - aEnd;
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
                isPast: t.endDate && t.endDate.toDate() < now
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

    const getLatestLog = (
        pet: PetExtended,
        treatment: TreatmentExtended,
        medication: MedicineDb
    ): MedicationLogExtended | undefined => {
        const logs = pet.logs.filter(log =>
            log.type === "medication" &&
            log.treatmentId === treatment.id &&
            log.medicineId === medication.id &&
            log.givenAt
        ) as MedicationLogExtended[];
        return logs.sort((a, b) => tsToDay(b.givenAt) - tsToDay(a.givenAt))[0];
    };

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
        if (dailyDose === undefined) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const scanStart = treatment.startDate.toDate();
        scanStart.setHours(0, 0, 0, 0);

        let scanEnd = today;

        if (medication.endDate) {
            const medEnd = medication.endDate.toDate();
            medEnd.setHours(0, 0, 0, 0);
            const dayAfterMedEnd = new Date(medEnd);
            dayAfterMedEnd.setDate(dayAfterMedEnd.getDate() + 1);
            if (dayAfterMedEnd < scanEnd) scanEnd = dayAfterMedEnd;
        };

        const missedDoses: MissedDoseRecord[] = [];
        const cursor = new Date(scanStart);

        while (cursor < scanEnd) {
            const given = getLoggedListForDate(pet, treatment, medication, cursor).length;
            const count = dailyDose - given;
            if (count > 0) {
                missedDoses.push({ date: new Date(cursor), count, medication: medication });
            }
            cursor.setDate(cursor.getDate() + 1);
        }
        return missedDoses;
    };

    return {
        loading,
        byStartThenEndDesc,
        isMedicationEnded,
        treatmentsThisMonth,
        activeTreatments,
        scheduledTreatments,
        getTodayLoggedList,
        getDailyDosesToLog,
        getDailyMissedDoses,
        getMissedDosesHistory,
    };

}