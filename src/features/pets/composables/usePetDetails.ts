import { computed, reactive, ref, watch } from "vue";
import { kgToGrams, prefersKg } from "../utils";
import { usePets } from "./usePets";

const isUpdatingInsurance = ref<boolean>(false);

export const usePetDetails = () => {
    const { selectedPet } = usePets();

    const chipData = ref<string>("");
    const isInsured = ref<boolean>(false);
    const insuranceData = reactive({
        company: "",
        policy: "",
        contact: "",
        web: "",
    });
    const preferredUnit = computed(() =>
        selectedPet.value && prefersKg(selectedPet.value) ? "kg" : "g",
    );
    const weightForm = reactive<{
        data: string;
        unit: "kg" | "g";
    }>({
        data: "",
        unit: preferredUnit.value,
    });

    const unitFactor = computed(() =>
        selectedPet.value && prefersKg(selectedPet.value) ? 1 / 1000 : 1,
    );

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