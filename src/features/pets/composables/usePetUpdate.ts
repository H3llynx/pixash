import { computed, reactive, ref, watch } from "vue";
import type { PetExtended } from "../types";
import { kgToGrams, prefersKg } from "../utils";

export const usePetUpdate = (pet: PetExtended) => {
    const loading = ref<boolean>(false);
    const preferredUnit = computed(() => prefersKg(pet) ? "kg" : "g");

    const formData = reactive<{
        data: string;
        unit: "kg" | "g";
    }>({
        data: "",
        unit: preferredUnit.value,
    });

    const getWeightInGrams = (): number | null => {
        const numeric = Number(formData.data);
        if (isNaN(numeric) || numeric <= 0) return null;
        return formData.unit === "kg" ? kgToGrams(numeric) : numeric;
    };

    watch(preferredUnit, (unit) => {
        formData.unit = unit;
    });

    return { loading, preferredUnit, formData, getWeightInGrams }
}