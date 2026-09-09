import { computed, reactive, ref, watch } from "vue";
import type { PetExtended } from "../types";
import { kgToGrams, prefersKg } from "../utils";

const isUpdatingInsurance = ref<boolean>(false);

export const usePetDetails = (pet: PetExtended) => {
    const chipData = ref<string>("");
    const isInsured = ref<boolean>(false);
    const insuranceData = reactive({
        company: "",
        policy: "",
        contact: "",
        web: "",
    });
    const preferredUnit = computed(() => prefersKg(pet) ? "kg" : "g");
    const weightForm = reactive<{
        data: string;
        unit: "kg" | "g";
    }>({
        data: "",
        unit: preferredUnit.value,
    });

    const unitFactor = prefersKg(pet) ? 1 / 1000 : 1;

    const getWeightInGrams = (): number | null => {
        const numeric = Number(weightForm.data);
        if (isNaN(numeric) || numeric <= 0) return null;
        return weightForm.unit === "kg" ? kgToGrams(numeric) : numeric;
    };

    watch(preferredUnit, (unit) => {
        weightForm.unit = unit;
    });

    return { chipData, isInsured, isUpdatingInsurance, insuranceData, weightForm, getWeightInGrams, unitFactor, preferredUnit }
}