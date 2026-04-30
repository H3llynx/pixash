<script setup lang="ts">
import { CalendarCheck, CalendarClock, Trash2 } from '@lucide/vue';
import { computed, provide, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import FormWrapper from '../../../../components/FormWrapper.vue';
import Input from '../../../../components/Input.vue';
import LoadingPuppy from '../../../../components/loading/LoadingPuppy.vue';
import Selector from '../../../../components/Selector.vue';
import { useFormMode } from '../../../../composables/useFormMode';
import { useToast } from '../../../../composables/useToast';
import { resetState, tsToDate } from '../../../../utils';
import PetSelector from '../../../pets/components/PetSelector.vue';
import { usePets } from '../../../pets/composables/usePets';
import { ANTIPARASITE_TYPES, antiparasiteFields } from '../../config';
import type { AntiparasiteExtended, AntiparasiteTypes } from '../../types';
import { getAntiparasites, resetForm } from '../../utils';

const { isAddingHealth, healthLoading, selectedLog, selectedDate, selectedPet } = usePets();
const { t } = useI18n();
const { show } = useToast();
const { mode, isReadonly } = useFormMode();
provide('readonly', isReadonly);

const { treated, givenDate, dueDate, product } = antiparasiteFields;
const antiparasitics = ref<AntiparasiteTypes[]>([]);
const error = ref<boolean>(false);
const fillLogData = (log: AntiparasiteExtended) => {
    Object.assign(formData, {
        treated: [...log.treated],
        givenAt: tsToDate(log.givenAt, "input"),
        dueOn: tsToDate(log.dueOn, "input"),
        product: log.product ?? "",
    })
};
const isVisible = computed(() => isAddingHealth.antiparasitic || mode.value === 'edit');
const defaultForm = {
    treated: [ANTIPARASITE_TYPES.default[0].id] as AntiparasiteTypes["id"][],
    givenAt: "",
    dueOn: "",
    product: "",
};
const formData = reactive({ ...defaultForm });
const handleClose = () => {
    /*     error.value = false;*/
    selectedDate.value = null;
    isAddingHealth.antiparasitic = false;
    resetState(selectedLog);
};

const handleDelete = async () => {
    const pet = selectedPet.value;
    const log = selectedLog.antiparasitic;
    if (!log || !pet) return;
    /*     open({
            title: t("dialog.deleteVaccine.title", { type: showTypes(vaccine.types, pet) }),
            message: t("dialog.deleteVaccine.message", { name: pet.name, type: showTypes(vaccine.types, pet) }),
            isDelete: true,
            onConfirm: async () => {
                try {
                    await deleteSelectedVaccine(vaccine, pet.id);
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.vaccineDeleted", { name: pet.name, type: showTypes(vaccine.types, pet) }),
                    });
                } catch (error) {
                    show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
                }
            }
        }); */
};

const handleSubmit = () => { };


watch(() => [isAddingHealth.antiparasitic, selectedLog.antiparasitic],
    (adding, editing) => {
        if (adding) formData.givenAt = selectedDate.value ?? "";
        else if (editing) mode.value = "view";
    }
);

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
        else {
            resetForm(formData, defaultForm);
            Object.assign(formData, {
                treated: [antiparasitics.value[0].id],
                givenAt: selectedDate.value ?? "",
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
            <div class="md:max-w-max" v-else>
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
                    <Selector :legend="t(treated.label)" class="treated-selector">
                        <Input v-model="formData.treated"
                            v-for="option in isReadonly ? antiparasitics.filter(o => formData.treated.includes(o.id)) : antiparasitics"
                            :id="option.id" :value="option.id" :key="option.id" :label="t(option.label)"
                            :type="treated.type" @input="error = false" />
                        <p v-if="error" class="text-sm w-full text-error pb-0.5">{{
                            t("health.antiparasiteForm.validationTypes") }}</p>
                    </Selector>
                    <div class="default-padding flex flex-col gap-1">
                        <Input v-if="isVisible" v-model="formData.givenAt" :id="givenDate.id"
                            :label="t(givenDate.label)" :type="givenDate.type" required>
                            <template #addon>
                                <CalendarCheck class=" mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <div v-else-if="selectedLog.antiparasitic && mode === 'view'">
                            <p>{{ t(givenDate.label) }}</p>
                            <p class="read-only">{{ tsToDate(selectedLog.antiparasitic.givenAt, "date") }}</p>
                        </div>
                        <Input v-if="isVisible" v-model="formData.dueOn" :id="dueDate.id" :label="t(dueDate.label)"
                            :type="dueDate.type" :min="formData.givenAt">
                            <template #addon>
                                <CalendarClock class="mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <div v-else-if="selectedLog.antiparasitic?.dueOn && mode === 'view'">
                            <p>{{ t(dueDate.label) }}</p>
                            <p class="read-only">{{ tsToDate(selectedLog.antiparasitic.dueOn, "date") }}</p>
                        </div>
                        <Input v-model="formData.product" :id="product.id" :label="t(product.label)"
                            :type="product.type" />
                        <div class="flex gap-1 mt-1 items-center" v-if="!selectedLog.antiparasitic || mode === 'edit'">
                            <div class="flex gap-0.5 flex-col md:flex-row  ml-auto">
                                <Button type="button" v-if="selectedLog.antiparasitic && mode === 'edit'"
                                    variant="secondary" size="sm" :disabled="healthLoading" @click="mode = 'view'">
                                    {{ t("common.button.cancel") }}
                                </Button>
                                <Button size="sm" :disabled="healthLoading">{{ t("health.cta.saveTreatment") }}</Button>
                            </div>
                        </div>
                        <Button v-if="selectedLog.antiparasitic && mode === 'view'" size="sm" class="mt-1 md:ml-auto"
                            @click="mode = 'edit'">
                            {{ t("health.title.editLog") }}
                        </Button>
                    </div>
                </form>
            </div>
        </FormWrapper>
    </Transition>
</template>

<style scoped>
:deep(label:not(:has(input[type="checkbox"]))) p,
:deep(legend) {
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
</style>