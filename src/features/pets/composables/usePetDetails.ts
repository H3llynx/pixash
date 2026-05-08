import { computed, reactive, ref, watch } from "vue";
import type { PetExtended } from "../types";
import { kgToGrams, prefersKg } from "../utils";

export const usePetDetails = (pet: PetExtended) => {
    const loading = ref<boolean>(false);
    const preferredUnit = computed(() => prefersKg(pet) ? "kg" : "g");

    const formPartialUpdate = reactive<{
        data: string;
        unit: "kg" | "g";
    }>({
        data: "",
        unit: preferredUnit.value,
    });

    const getWeightInGrams = (): number | null => {
        const numeric = Number(formPartialUpdate.data);
        if (isNaN(numeric) || numeric <= 0) return null;
        return formPartialUpdate.unit === "kg" ? kgToGrams(numeric) : numeric;
    };

    watch(preferredUnit, (unit) => {
        formPartialUpdate.unit = unit;
    });

    return { loading, preferredUnit, formPartialUpdate, getWeightInGrams }
}