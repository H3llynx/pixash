import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDialog } from "../../../composables/useDialog";
import { useToast } from "../../../composables/useToast";
import { getOneYearLaterInput, shallowEqual, tsToDate } from "../../../utils";
import { usePets } from "../../pets/composables/usePets";
import { getAge } from "../../pets/utils";
import { STAGE, VACCINE_TYPES } from "../config";
import type { VaccineExtended, VaccineTypes } from "../types";
import { getVaccineTypes, resetForm, showTypes } from "../utils";
import { useEvents } from "./useEvents";

export const useVaccineForm = () => {
    const { selectedPet, isAddingHealth, vets, selectedVet, selectedVaccine, selectVaccine, addNewVaccine, healthError, updateSelectedVaccine, deleteSelectedVaccine } = usePets();
    const { selectedDate } = useEvents();
    const { show } = useToast();
    const { open } = useDialog();
    const { t } = useI18n();

    const loading = ref<boolean>(false);
    const vaccineTypes = ref<VaccineTypes[]>([]);
    const error = ref<boolean>(false);
    const vetTextInput = ref<boolean>(false);
    const date = computed(() => selectedDate.value ?? "");
    const givenBy = computed(() => {
        if (selectedVet.value) return selectedVet.value.id;
        const pet = selectedPet.value;
        if (pet) {
            const vetForPet = vets.value?.find(v => v.assignedPets?.includes(pet.id));
            if (vetForPet) return vetForPet.id;
        }
        return vets.value?.[0]?.id ?? "";
    });
    const defaultForm = {
        types: [VACCINE_TYPES.default[0].id] as VaccineTypes["id"][],
        stage: "adult" as typeof STAGE[number]["id"],
        given: false,
        givenAt: "",
        nextDose: false,
        dueOn: "",
        vet: "",
        notes: "",
    };
    const fillVaccineData = (vaccine: VaccineExtended) => {
        const isRegisteredVet = vets.value?.some(vet => vet.id === vaccine.vet);
        vetTextInput.value = !isRegisteredVet;
        Object.assign(formData, {
            types: [...vaccine.types],
            stage: vaccine.stage,
            given: vaccine.givenAt ? true : false,
            givenAt: tsToDate(vaccine.givenAt, "input"),
            nextDose: vaccine.dueOn ? true : false,
            dueOn: tsToDate(vaccine.dueOn, "input"),
            vet: vaccine.vet ?? "",
            notes: vaccine.notes ?? "",
        })
    };
    const formData = reactive({ ...defaultForm });

    const handleClose = () => {
        error.value = false;
        selectedDate.value = null;
        isAddingHealth.vaccine = false;
        selectVaccine(null);
        resetForm(formData, defaultForm);
    };

    const handleSubmit = async () => {
        if (!selectedPet.value) return;
        if (!formData.types.length) {
            error.value = true;
            return;
        };
        const typesSnapshot = [...formData.types];
        loading.value = true;
        try {
            if (isAddingHealth.vaccine) {
                await addNewVaccine({ ...formData }, selectedPet.value.id);
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.vaccineAdded", { name: selectedPet.value.name, type: showTypes(typesSnapshot, selectedPet.value) }),
                });
            }
            else if (selectedVaccine.value) {
                const originalData = {
                    ...selectedVaccine.value,
                    givenAt: tsToDate(selectedVaccine.value.givenAt, "input"),
                    dueOn: tsToDate(selectedVaccine.value.dueOn, "input"),
                    given: selectedVaccine.value.givenAt ? true : false,
                    nextDose: selectedVaccine.value.dueOn ? true : false,
                };

                if (!shallowEqual(formData, originalData)) {
                    await updateSelectedVaccine(selectedVaccine.value, selectedPet.value.id, { ...formData });
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.vaccineUpdated", { name: selectedPet.value.name, type: showTypes(typesSnapshot, selectedPet.value) }),
                    });
                }
            };
            resetForm(formData, defaultForm);
        }
        catch (e) {
            show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
        }
        finally {
            loading.value = false;
        };
    };

    const handleDelete = async () => {
        const pet = selectedPet.value;
        const vaccine = selectedVaccine.value;
        if (!vaccine || !pet) return;
        open({
            title: t("dialog.deleteEvent.title", { title: showTypes(vaccine.types, pet) }),
            message: t("dialog.deleteEvent.message", { name: pet.name, title: showTypes(vaccine.types, pet) }),
            isDelete: true,
            onConfirm: async () => {
                loading.value = true;
                try {
                    await deleteSelectedVaccine(vaccine, pet.id);
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.eventDeleted", { name: pet.name, title: showTypes(vaccine.types, pet) }),
                    });
                } catch (error) {
                    show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
                } finally { loading.value = false; }
            }
        });
        resetForm(formData, defaultForm);
    };

    watch(() => [selectedPet.value, selectedVaccine.value] as const,
        ([pet, vaccine]) => {
            if (!pet) {
                resetForm(formData, defaultForm);
                return;
            };
            const options = getVaccineTypes(pet.species);
            if (!options || !options.length) return;
            vaccineTypes.value = options;
            if (vaccine) fillVaccineData(vaccine);
            else {
                resetForm(formData, defaultForm);
                Object.assign(formData, {
                    types: [vaccineTypes.value[0].id],
                    stage: getAge(pet)?.stage,
                    dueOn: date.value,
                    vet: givenBy.value
                });
            }
        },
        { immediate: true }
    );

    watch(() => formData.given, (given) => {
        if (given) {
            formData.givenAt = selectedVaccine.value?.givenAt
                ? tsToDate(selectedVaccine.value.givenAt, "input") as string
                : date.value;
            formData.nextDose = selectedVaccine.value?.dueOn ? true : false;
            formData.dueOn = (formData.nextDose && selectedVaccine.value?.dueOn)
                ? tsToDate(selectedVaccine.value?.dueOn, "input") as string
                : ""
        } else {
            formData.givenAt = "";
            formData.nextDose = false;
            formData.dueOn = selectedVaccine.value?.dueOn
                ? tsToDate(selectedVaccine.value?.dueOn, "input") as string
                : date.value;
        }
    });

    watch(() => formData.nextDose, (nextDose) => {
        if (nextDose) {
            formData.dueOn = selectedVaccine.value?.dueOn
                ? tsToDate(selectedVaccine.value.dueOn, "input") as string
                : getOneYearLaterInput(formData.givenAt) ?? date.value
        } else formData.dueOn = (!formData.givenAt && selectedVaccine.value?.dueOn)
            ? tsToDate(selectedVaccine.value?.dueOn, "input") as string
            : "";
    });

    return { loading, vetTextInput, date, givenBy, fillVaccineData, formData, vaccineTypes, error, handleClose, handleSubmit, handleDelete }
}