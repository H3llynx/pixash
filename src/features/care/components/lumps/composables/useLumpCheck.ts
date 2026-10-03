import { Timestamp } from "firebase/firestore";
import { reactive, ref } from "vue";
import { useAddPictures, type Picture } from "../../../../../composables/useAddPictures";
import { resetForm } from "../../../../../utils";
import { lumpFields } from "../../../config";
import type { LumpCheck, LumpCheckRecord, LumpExtended } from "../../../types";
import { isLumpRemoved, toMm } from "../../../utils";

const isModalOpen = ref<boolean>(false);
const checkedLump = ref<LumpExtended | null>(null);

export const useLumpCheck = () => {
    const pictures = ref<Picture[]>([]);
    const loadedPictures = reactive(new Set<string>());

    const { resetFormPictureState } = useAddPictures(pictures);
    const { status } = lumpFields;

    const defaultCheck: LumpCheckRecord = {
        size: {
            value: "",
            displayUnit: "cm" as "cm" | "mm"
        },
        pictures: [] as string[],
        notes: "",
        status: status.options[0].id,
    };

    const checkData = reactive(structuredClone(defaultCheck));

    const resetCheckData = () => resetForm(checkData, defaultCheck);

    const isCheckEmpty = (checkData: LumpCheckRecord, lastStatus: string | undefined) => {
        return (
            !checkData.size.value &&
            checkData.pictures.length === 0 &&
            !checkData.notes &&
            checkData.status === lastStatus
        );
    };

    const logCheck = (checkRecord: LumpCheckRecord): LumpCheck => {
        const check: LumpCheck = { date: Timestamp.now() };

        if (checkRecord.size?.value) {
            check.size = {
                displayUnit: checkRecord.size.displayUnit,
                valueMm: String(toMm(Number(checkRecord.size.value), checkRecord.size.displayUnit)),
            };
        }
        if (checkRecord.pictures?.length) check.pictures = [...checkRecord.pictures];
        if (checkRecord.notes) check.notes = checkRecord.notes;
        if (checkRecord.status) check.status = checkRecord.status;

        return check;
    };

    const openModal = (lump: LumpExtended) => {
        checkedLump.value = lump;
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        resetCheckData();
        resetFormPictureState(loadedPictures);
        checkedLump.value = null;
    };

    type SizeEntry = { date: Timestamp; valueMm: number };

    const getSizeHistory = (checks: LumpCheck[]): SizeEntry[] => {
        return checks
            .filter((c): c is LumpCheck & { size: NonNullable<LumpCheck["size"]> } => !!c.size)
            .map(c => ({ date: c.date, valueMm: Number(c.size.valueMm) }))
            .sort((a, b) => a.date.toMillis() - b.date.toMillis());
    };

    const NOISE_THRESHOLD_MM = 1;

    const getSizeTrend = (lump: LumpExtended): "up" | "down" | "stable" | null => {
        const history = getSizeHistory(lump.checks);
        if (history.length < 2 || isLumpRemoved(lump)) return null;
        const last = history[history.length - 1];
        const prev = history[history.length - 2];
        const deltaMm = last.valueMm - prev.valueMm;
        const direction =
            Math.abs(deltaMm) < NOISE_THRESHOLD_MM ? "stable" : deltaMm > 0 ? "up" : "down";
        return direction;
    };

    return { checkedLump, pictures, loadedPictures, resetFormPictureState, checkData, resetCheckData, isCheckEmpty, logCheck, isModalOpen, openModal, closeModal, getSizeTrend };
}