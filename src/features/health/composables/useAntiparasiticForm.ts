import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDialog } from "../../../composables/useDialog";
import { useToast } from "../../../composables/useToast";
import { resetState, tsToDate } from "../../../utils";
import { usePets } from "../../pets/composables/usePets";
import { ANTIPARASITE_TYPES } from "../config";
import type { AntiparasiteLogExtended, AntiparasiteTypes, Log, PetEvent } from "../types";
import { getAntiparasites, resetForm } from "../utils";
import { useEvents } from "./useEvents";

export const useAntiparasiticForm = () => {
    const { logs, isAddingHealth, healthError, selectedLog, selectedPet, addNewLog, updateSelectedLog, deleteSelectedLog } = usePets();
    const { selectedDate } = useEvents();
    const { t } = useI18n();
    const { show } = useToast();
    const { open } = useDialog();
    const antiparasitics = ref<AntiparasiteTypes[]>([]);
    const error = ref<boolean>(false);
    const newLog = ref<PetEvent | null>(null);
    const givenAt = computed(() => selectedDate.value ?? new Date().toISOString().slice(0, 10));
    const fillLogData = (log: AntiparasiteLogExtended) => {
        Object.assign(formData, {
            treated: [...log.treated],
            givenAt: tsToDate(log.givenAt, "input"),
            dueOn: tsToDate(log.dueOn, "input"),
            notes: log.notes ?? "",
        })
    };
    const defaultForm = {
        treated: [ANTIPARASITE_TYPES.default[0].id] as AntiparasiteTypes["id"][],
        givenAt: "",
        dueOn: "",
        notes: "",
    };
    const formData = reactive({ ...defaultForm });
    const handleClose = () => {
        newLog.value = null;
        error.value = false;
        selectedDate.value = null;
        isAddingHealth.antiparasitic = false;
        resetState(selectedLog);
    };

    const handleDelete = async () => {
        const pet = selectedPet.value;
        const log = selectedLog.antiparasitic;
        if (!log || !pet) return;
        open({
            title: t("dialog.deleteLog.title", { type: log.type }),
            message: t("dialog.deleteLog.message"),
            isDelete: true,
            onConfirm: async () => {
                try {
                    await deleteSelectedLog(log, pet.id);
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.logDeleted", { type: log.type }),
                    });
                } catch (error) {
                    show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
                }
            }
        });
    };

    const handleSubmit = async () => {
        if (!selectedPet.value) return;
        if (!formData.treated.length) {
            error.value = true;
            return;
        };
        const log: Log = { ...formData, type: "antiparasite" };
        try {
            if (isAddingHealth.antiparasitic) {
                const logId = await addNewLog(log, selectedPet.value.id);
                if (logId) newLog.value = logs.value.find(l => l.id === logId) ?? null
            }
            else if (selectedLog.antiparasitic) {
                const logId = selectedLog.antiparasitic.id;
                await updateSelectedLog(selectedLog.antiparasitic, selectedPet.value.id, log);
                newLog.value = logs.value.find(l => l.id === logId) ?? null
            };
        }
        catch (e) {
            show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
        };
    };

    watch(() => isAddingHealth.antiparasitic, (adding) => {
        if (adding) {
            formData.givenAt = givenAt.value;
        }
    });

    watch(() => [selectedPet.value, selectedLog.antiparasitic] as const,
        ([pet, log]) => {
            if (!pet) {
                resetForm(formData, defaultForm);
                return;
            };
            const options = getAntiparasites(pet.species);
            if (!options || !options.length) return;
            antiparasitics.value = options;
            if (log) fillLogData(log);
            else if (!selectedLog.antiparasitic) {
                resetForm(formData, defaultForm);
                Object.assign(formData, {
                    treated: [antiparasitics.value[0].id],
                    givenAt: givenAt.value
                });
            }
        },
        { immediate: true }
    );
    return { formData, fillLogData, newLog, handleClose, handleDelete, handleSubmit, antiparasitics, error }
}