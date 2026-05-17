import { computed, reactive, ref, watch } from "vue";
import type { PetExtended } from "../types";
import { kgToGrams, prefersKg } from "../utils";

export const usePetDetails = (pet: PetExtended) => {
    const loading = ref<boolean>(false);
    const chipData = ref<string>("");
    const preferredUnit = computed(() => prefersKg(pet) ? "kg" : "g");

    const weightForm = reactive<{
        data: string;
        unit: "kg" | "g";
    }>({
        data: "",
        unit: preferredUnit.value,
    });

    const getWeightInGrams = (): number | null => {
        const numeric = Number(weightForm.data);
        if (isNaN(numeric) || numeric <= 0) return null;
        return weightForm.unit === "kg" ? kgToGrams(numeric) : numeric;
    };

    watch(preferredUnit, (unit) => {
        weightForm.unit = unit;
    });

    return { chipData, loading, weightForm, getWeightInGrams }
}