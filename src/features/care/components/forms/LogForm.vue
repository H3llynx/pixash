<script setup lang="ts">
import { CalendarCheck, Trash2 } from '@lucide/vue';
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Input from '../../../../components/Input.vue';
import LoadingPuppy from '../../../../components/loading/LoadingPuppy.vue';
import Panel from '../../../../components/Panel.vue';
import Selector from '../../../../components/Selector.vue';
import Textarea from '../../../../components/Textarea.vue';
import { useDialog } from '../../../../composables/useDialog.ts';
import { useFormMode } from '../../../../composables/useFormMode.ts';
import { useToast } from '../../../../composables/useToast.ts';
import { shallowEqual, tsToDate } from '../../../../utils.ts';
import PetIcon from '../../../pets/components/PetIcon.vue';
import PetSelector from '../../../pets/components/PetSelector.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import { logFields } from '../../../pets/config.ts';
import { useEvents } from '../../composables/useEvents.ts';
import type { Log, OtherLogExtended } from '../../types.ts';
import { resetForm } from '../../utils.ts';

const { selectedPet, deleteSelectedLog, healthError, isAddingCare, selectedLog, addNewLog, updateSelectedLog } = usePets();
const { selectedDate } = useEvents();
const { t } = useI18n();
const { show } = useToast();
const { open } = useDialog();
const { mode } = useFormMode();
const { subtype, date, notes } = logFields;
const loading = ref<boolean>(false);
const error = ref<boolean>(false);
const defaultForm = {
    subtype: subtype.options[0].id,
    date: "",
    notes: ""
};
const formData = reactive({ ...defaultForm });

const fillLogData = (log: OtherLogExtended) => {
    Object.assign(formData, {
        subtype: log.subtype,
        date: tsToDate(log.date, "input"),
        notes: log.notes ?? "",
    })
};

const handleClose = () => {
    error.value = false;
    selectedDate.value = null;
    isAddingCare.other = false;
    selectedLog.other = null;
};

const handleSubmit = async () => {
    if (!selectedPet.value) return;
    const log: Log = { ...formData, type: "other" };
    loading.value = true
    try {
        if (isAddingCare.other) {
            await addNewLog(log, selectedPet.value.id);
            show({
                type: "success",
                title: t("toast.success.title.generic"),
                message: t("toast.success.message.logAdded", { name: selectedPet.value.name, type: t(`pet.logs.${formData.subtype}`) }),
            });
            resetForm(formData, defaultForm);
        }
        else if (selectedLog.other) {
            const originalData = {
                ...selectedLog.other,
                subtype: selectedLog.other.subtype,
                date: tsToDate(selectedLog.other.date, "input"),
                notes: selectedLog.other.notes ?? "",
            };
            if (!shallowEqual(formData, originalData)) {
                await updateSelectedLog(selectedLog.other, selectedPet.value.id, log);
                resetForm(formData, defaultForm);
            };
        };
    }
    catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
    }
    finally { loading.value = false; }
};

const handleDelete = () => {
    const pet = selectedPet.value;
    const log = selectedLog.other;
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

watch(() => isAddingCare.other, (adding) => {
    if (adding) {
        mode.value = "edit";
        Object.assign(formData, { date: selectedDate.value ?? "" });
    };
});

watch(() => selectedLog.other, (log) => {
    mode.value = log ? "view" : "edit";
});

watch(() => mode.value, (mode) => {
    if (mode === "view") fillLogData(selectedLog.other!);
});
</script>

<template>
    <Transition name="panel">
        <Panel v-if="isAddingCare.other || selectedLog.other" :onClose="handleClose">
            <LoadingPuppy v-if="loading" />
            <div class="md:max-w-max" v-else>
                <div class="flex gap-1 justify-between my-1 default-padding">
                    <div v-if="selectedLog.other && selectedPet"
                        class="rounded-full w-3 h-3 bg-brand-rgba text-3xl flex shrink-0 justify-center items-center">
                        <PetIcon :pet="selectedPet" />
                    </div>
                    <h1 v-if="mode === 'edit'">{{ t("pet.title.addLog") }}</h1>
                    <h1 v-else class="font-medium">{{ selectedPet!.name }} · {{ t("pet.title.editLog", {
                        subtype:
                            t(`pet.logs.${selectedLog.other!.subtype}`).toLowerCase()
                    })
                    }}
                    </h1>
                    <div class="ml-auto mb-auto flex gap-0.5">
                        <Button v-if="selectedLog.other" variant="ghost" size="xs"
                            :aria-label="t('pet.cta.deleteLog', { subtype: t(`pet.logs.${selectedLog.other!.subtype}`) })"
                            @click="handleDelete">
                            <Trash2 :size="22" color="var(--color-brand-light)" />
                        </Button>
                    </div>
                </div>
                <PetSelector v-if="isAddingCare.other" form />
                <form @submit.prevent="handleSubmit" class="mt-1">
                    <Selector :legend="t(subtype.label)" class="mb-0.5">
                        <Input v-model="formData.subtype" v-for="option in subtype.options" :id="option.id"
                            :value="option.id" :key="option.id" :label="t(option.label)" :type="subtype.type" />
                    </Selector>
                    <div class="default-padding flex flex-col gap-1">
                        <Input v-model="formData.date" :id="date.id" :label="t(date.label)" :type="date.type"
                            :class="mode === 'view'" required>
                            <template #addon>
                                <CalendarCheck class=" mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <label :for="notes.id" v-if="selectedLog.other?.notes || mode === 'edit'">
                            <p>{{ t(notes.label) }}</p>
                            <Textarea v-model="formData.notes" :id="notes.id"
                                :readonly="!!selectedLog.other && mode === 'view'" :placeholder="t(notes.placeholder)"
                                :maxLength="500" />
                        </label>
                        <div class="flex gap-0.5 mt-1 items-center ml-auto"
                            v-if="!selectedLog.other || mode === 'edit'">
                            <Button type="button" v-if="selectedLog.other && mode === 'edit'" variant="secondary"
                                size="sm" :disabled="loading" @click="mode = 'view'">
                                {{ t("common.button.cancel") }}
                            </Button>
                            <Button size="sm" :disabled="loading">{{ t("pet.cta.saveLog", {
                                subtype:
                                    t(`pet.logs.${formData.subtype}`).toLowerCase()
                            })
                            }}</Button>
                        </div>
                        <Button v-if="selectedLog.other && mode === 'view'" size="sm" class="mt-1 md:ml-auto"
                            @click="mode = 'edit'">
                            {{ t("common.button.edit") }}
                        </Button>
                    </div>
                </form>
            </div>
        </Panel>
    </Transition>
</template>

<style scoped>
legend,
:deep(label p),
:deep(label span) {
    font-size: medium;
}

:deep(fieldset label p) {
    font-size: 14px;
}
</style>