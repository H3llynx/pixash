import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDialog } from "../../../composables/useDialog";
import { useToast } from "../../../composables/useToast";
import { resetLogs, shallowEqual, todayAsInput, tsToDate } from "../../../utils";
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
    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);
    const newLog = ref<PetEvent | null>(null);
    const today = todayAsInput();
    const givenAt = computed(() => selectedDate.value && selectedDate.value <= today ? selectedDate.value : formData.notGiven ? "" : today);
    const dueOn = computed(() => selectedDate.value && selectedDate.value > givenAt.value ? selectedDate.value : "");
    const fillLogData = (log: AntiparasiteLogExtended) => {
        Object.assign(formData, {
            treated: [...log.treated],
            givenAt: tsToDate(log.givenAt, "input"),
            notGiven: log.givenAt ? false : true,
            dueOn: tsToDate(log.dueOn, "input"),
            notes: log.notes ?? "",
        })
    };
    const defaultForm = {
        treated: [ANTIPARASITE_TYPES.default[0].id] as AntiparasiteTypes["id"][],
        notGiven: false,
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
        resetLogs(selectedLog);
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
                    loading.value = true;
                    await deleteSelectedLog(log, pet.id);
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.logDeleted", { type: log.type }),
                    });
                } catch (error) {
                    show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
                } finally { loading.value = false; }
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
        loading.value = true
        try {
            if (isAddingHealth.antiparasitic) {
                const logId = await addNewLog(log, selectedPet.value.id);
                if (logId) newLog.value = logs.value.find(l => l.id === logId) as AntiparasiteLogExtended ?? null
            }
            else if (selectedLog.antiparasitic) {
                const originalData = {
                    treated: selectedLog.antiparasitic.treated,
                    givenAt: tsToDate(selectedLog.antiparasitic.givenAt, "input"),
                    dueOn: tsToDate(selectedLog.antiparasitic.dueOn, "input"),
                    notes: selectedLog.antiparasitic.notes ?? "",
                };
                if (!shallowEqual(formData, originalData)) {
                    const logId = selectedLog.antiparasitic.id;
                    await updateSelectedLog(selectedLog.antiparasitic, selectedPet.value.id, log);
                    newLog.value = logs.value.find(l => l.id === logId) as AntiparasiteLogExtended ?? null
                };
            };
            resetForm(formData, defaultForm);
        }
        catch (e) {
            show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
        }
        finally { loading.value = false; }
    };

    watch(() => isAddingHealth.antiparasitic, (adding) => {
        if (adding) {
            formData.givenAt = givenAt.value;
            formData.dueOn = dueOn.value
        };
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

    watch(() => formData.notGiven, (notGiven) => {
        if (notGiven) {
            formData.givenAt = ""
            if (selectedDate.value) formData.dueOn = selectedDate.value;
        } else {
            formData.givenAt = selectedLog.antiparasitic?.givenAt
                ? tsToDate(selectedLog.antiparasitic.givenAt, "input") as string
                : formData.dueOn ? ""
                    : selectedDate.value || todayAsInput()
        };
    });

    watch(() => selectedDate.value, (date) => {
        if (date && date > today) formData.notGiven = true;
        else formData.notGiven = false;
    })

    return { formData, fillLogData, newLog, handleClose, handleDelete, handleSubmit, antiparasitics, error, loading }
}