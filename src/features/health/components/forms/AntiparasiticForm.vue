<script setup lang="ts">
import { CalendarCheck, CalendarClock, Trash2 } from '@lucide/vue';
import { computed, provide, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import FormWrapper from '../../../../components/FormWrapper.vue';
import Input from '../../../../components/Input.vue';
import LoadingPuppy from '../../../../components/loading/LoadingPuppy.vue';
import Selector from '../../../../components/Selector.vue';
import { useDialog } from '../../../../composables/useDialog';
import { useFormMode } from '../../../../composables/useFormMode';
import { useToast } from '../../../../composables/useToast';
import { resetState, tsToDate } from '../../../../utils';
import PetSelector from '../../../pets/components/PetSelector.vue';
import { usePets } from '../../../pets/composables/usePets';
import { ANTIPARASITE_TYPES, antiparasiteFields } from '../../config';
import type { AntiparasiteTypes, LogExtended } from '../../types';
import { getAntiparasites, resetForm } from '../../utils';
import LogSuccess from '../LogSuccess.vue';

const { isAddingHealth, healthLoading, healthError, selectedLog, selectedDate, selectedPet, addNewLog, updateSelectedLog, deleteSelectedLog } = usePets();
const { t } = useI18n();
const { show } = useToast();
const { open } = useDialog();
const { mode, isReadonly } = useFormMode();
provide('readonly', isReadonly);

const { treated, givenDate, dueDate, other } = antiparasiteFields;
const antiparasitics = ref<AntiparasiteTypes[]>([]);
const error = ref<boolean>(false);
const success = ref<boolean>(false);
const givenAt = computed(() => selectedDate.value ?? new Date().toISOString().slice(0, 10));
const fillLogData = (log: LogExtended) => {
    Object.assign(formData, {
        treated: [...log.treated],
        givenAt: tsToDate(log.givenAt, "input"),
        dueOn: tsToDate(log.dueOn, "input"),
        other: log.other ?? "",
    })
};
const isVisible = computed(() => isAddingHealth.antiparasitic || mode.value === 'edit');
const defaultForm = {
    treated: [ANTIPARASITE_TYPES.default[0].id] as AntiparasiteTypes["id"][],
    givenAt: "",
    dueOn: "",
    other: "",
};
const formData = reactive({ ...defaultForm });

const handleClose = () => {
    success.value = false;
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
    const log = { ...formData, type: "antiparasitic" }
    try {
        if (isAddingHealth.antiparasitic) await addNewLog(log, selectedPet.value.id);
        else if (selectedLog.antiparasitic) await updateSelectedLog(selectedLog.antiparasitic, selectedPet.value.id, log);
        success.value = true;
    }
    catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
    };
};

watch(() => selectedLog.antiparasitic, (log) => {
    mode.value = log ? "view" : "edit";
});

watch(() => mode.value, (mode) => {
    if (mode === "view") fillLogData(selectedLog.antiparasitic!)
})

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
</script>

<template>
    <Transition name="panel">
        <FormWrapper v-if="isAddingHealth.antiparasitic || selectedLog.antiparasitic" :onClose="handleClose">
            <LoadingPuppy v-if="healthLoading" />
            <div class="md:max-w-max" v-else-if="!success">
                <div class="flex gap-1 justify-between my-1 default-padding">
                    <h1>{{ t("health.title.logAntiparasitic") }}</h1>
                    <div class="ml-auto mb-auto flex gap-0.5">
                        <Button v-if="selectedLog.antiparasitic" variant="ghost" size="xs"
                            :aria-label="t('health.cta.deleteVaccine')" @click="handleDelete">
                            <Trash2 :size="22" color="var(--color-brand-light)" />
                        </Button>
                    </div>
                </div>
                <PetSelector v-if="isAddingHealth.antiparasitic" form />
                <form @submit.prevent="handleSubmit" class="mt-1">
                    <Selector :legend="t(treated.label)" class="mb-0.5">
                        <Input v-model="formData.treated"
                            v-for="option in isReadonly ? antiparasitics.filter(o => formData.treated.includes(o.id)) : antiparasitics"
                            :id="option.id" :value="option.id" :key="option.id" :label="t(option.label)"
                            :type="treated.type" @input="error = false" />
                        <p v-if="error" class="text-sm w-full text-error pb-0.5">{{
                            t("health.antiparasiteForm.validationTypes") }}</p>
                    </Selector>
                    <div class="default-padding flex flex-col gap-1">
                        <Input v-if="isVisible" v-model="formData.givenAt" :id="givenDate.id" class="bg-brand-rgba"
                            :label="t(givenDate.label)" :type="givenDate.type" required>
                            <template #addon>
                                <CalendarCheck class="mr-0.5" color="var(--color-brand)" />
                            </template>
                        </Input>
                        <div v-else-if="selectedLog.antiparasitic && mode === 'view'">
                            <p class="read-only-label">{{ t(givenDate.label) }}</p>
                            <p class="read-only">{{ tsToDate(selectedLog.antiparasitic.givenAt, "date") }}</p>
                        </div>
                        <Input v-if="isVisible" v-model="formData.dueOn" :id="dueDate.id" :label="t(dueDate.label)"
                            :type="dueDate.type" :min="formData.givenAt">
                            <template #addon>
                                <CalendarClock v-if="!formData.dueOn" class="mr-0.5" color="var(--color-border)" />
                                <Button v-else type="button" variant="ghost" size="xs" @click="formData.dueOn = ''">{{
                                    t("common.button.clear") }}</Button>
                            </template>
                        </Input>
                        <div v-else-if="selectedLog.antiparasitic?.dueOn && mode === 'view'">
                            <p class="read-only-label">{{ t(dueDate.label) }}</p>
                            <p class="read-only">{{ tsToDate(selectedLog.antiparasitic.dueOn, "date") }}</p>
                        </div>
                        <Input v-if="selectedLog.antiparasitic?.other || isVisible" v-model="formData.other"
                            :id="other.id" :label="t(other.label)" :type="other.type" />
                        <div class="flex gap-0.5 mt-1 items-center ml-auto"
                            v-if="!selectedLog.antiparasitic || mode === 'edit'">
                            <Button type="button" v-if="selectedLog.antiparasitic && mode === 'edit'"
                                variant="secondary" size="sm" :disabled="healthLoading" @click="mode = 'view'">
                                {{ t("common.button.cancel") }}
                            </Button>
                            <Button size="sm" :disabled="healthLoading">{{ t("health.cta.saveTreatment") }}</Button>
                        </div>
                        <Button v-if="selectedLog.antiparasitic && mode === 'view'" size="sm" class="mt-1 md:ml-auto"
                            @click="mode = 'edit'">
                            {{ t("common.button.update") }}
                        </Button>
                    </div>
                </form>
            </div>
            <LogSuccess v-else-if="success" :onClose="handleClose" :pet="selectedPet!" :treated="formData.treated" />
        </FormWrapper>
    </Transition>
</template>

<style scoped>
:deep(label:not(:has(input[type="checkbox"]))) p,
:deep(legend),
.read-only-label {
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 500;
    letter-spacing: 1px;
    font-size: 14px;
}

:deep(label:has(input[type="checkbox"])) p {
    display: flex;
    height: 3rem;
    padding-inline: 1rem;
    justify-content: center;
    align-items: center;
    border-radius: 0.75rem;
}

:deep(label:has(input[type="checkbox"]:checked)) p {
    background: var(--color-brand-rgba);
    border-color: var(--color-brand-light);
    color: var(--color-brand-light);
    font-weight: 500;
}
</style>