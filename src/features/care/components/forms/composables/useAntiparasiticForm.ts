import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useDialog } from "../../../../../composables/useDialog";
import { useToast } from "../../../../../composables/useToast";
import { shallowEqual, todayAsInput, tsToDate } from "../../../../../utils";
import { usePets } from "../../../../pets/composables/usePets";
import { useEvents } from "../../../composables/useEvents";
import { ANTIPARASITE_TYPES } from "../../../config";
import type { AntiparasiteLogExtended, AntiparasiteTypes, Log, PetEvent } from "../../../types";
import { getAntiparasites, resetForm } from "../../../utils";

export const useAntiparasiticForm = () => {
    const { logs, isAddingCare, careError, selectLog, selectedAntiparasiticLog, selectedPet, addNewLog, updateSelectedLog, deleteSelectedLog } = usePets();
    const { selectedDate } = useEvents();
    const { t } = useI18n();
    const { show } = useToast();
    const { open } = useDialog();

    const antiparasitics = ref<AntiparasiteTypes[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);
    const newLog = ref<PetEvent | null>(null);
    const givenAt = computed(() => selectedDate.value && selectedDate.value <= todayAsInput() ? selectedDate.value : formData.notGiven ? "" : todayAsInput());
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
        isAddingCare.antiparasitic = false;
        selectLog(null);
    };

    const handleDelete = async () => {
        const pet = selectedPet.value;
        const log = selectedAntiparasiticLog.value;
        if (!log || !pet) return;
        open({
            title: t("dialog.deleteRecord.title", { name: pet.name, title: t("events.antiparasitics").toLowerCase() }),
            message: t("dialog.deleteGenericMsg"),
            isDelete: true,
            onConfirm: async () => {
                try {
                    loading.value = true;
                    await deleteSelectedLog(log, pet.id);
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.logDeleted"),
                    });
                } catch (error) {
                    show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
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
            if (isAddingCare.antiparasitic) {
                const logId = await addNewLog(log, selectedPet.value.id);
                if (logId) newLog.value = logs.value.find(l => l.id === logId) as AntiparasiteLogExtended ?? null;
                resetForm(formData, defaultForm);
            }
            else if (selectedAntiparasiticLog.value) {
                const originalData = {
                    ...selectedAntiparasiticLog.value,
                    givenAt: tsToDate(selectedAntiparasiticLog.value.givenAt, "input"),
                    dueOn: tsToDate(selectedAntiparasiticLog.value.dueOn, "input"),
                    notes: selectedAntiparasiticLog.value.notes ?? "",
                    notGiven: selectedAntiparasiticLog.value.givenAt ? false : true,
                };
                if (!shallowEqual(formData, originalData)) {
                    const logId = selectedAntiparasiticLog.value.id;
                    await updateSelectedLog(selectedAntiparasiticLog.value, selectedPet.value.id, log);
                    newLog.value = logs.value.find(l => l.id === logId) as AntiparasiteLogExtended ?? null;
                    resetForm(formData, defaultForm);
                };
            };
        }
        catch (e) {
            show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
        }
        finally { loading.value = false; }
    };

    watch(() => isAddingCare.antiparasitic, (adding) => {
        if (adding) {
            formData.givenAt = givenAt.value;
            formData.dueOn = dueOn.value
        };
    });

    watch(() => [selectedPet.value, selectedAntiparasiticLog.value, selectedDate.value] as const,
        ([pet, log, date]) => {
            if (!pet) {
                resetForm(formData, defaultForm);
                return;
            };
            const options = getAntiparasites(pet.species);
            if (!options || !options.length) return;
            antiparasitics.value = options;
            if (log) {
                fillLogData(log);
            } else {
                resetForm(formData, defaultForm);
                const isPast = !!date && date <= todayAsInput();
                const isFuture = !!date && date > todayAsInput();
                Object.assign(formData, {
                    treated: [antiparasitics.value[0].id],
                    notGiven: isFuture,
                    givenAt: isPast ? date : "",
                    dueOn: isFuture ? date : "",
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
            formData.givenAt = selectedAntiparasiticLog.value?.givenAt
                ? tsToDate(selectedAntiparasiticLog.value.givenAt, "input") as string
                : formData.dueOn ? ""
                    : selectedDate.value || todayAsInput()
        };
    });

    return { formData, fillLogData, newLog, handleClose, handleDelete, handleSubmit, antiparasitics, error, loading }
}