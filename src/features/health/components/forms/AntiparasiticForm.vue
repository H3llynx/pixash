<script setup lang="ts">
import { CalendarCheck, CalendarClock, Trash2 } from '@lucide/vue';
import { provide, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import FormWrapper from '../../../../components/FormWrapper.vue';
import Input from '../../../../components/Input.vue';
import LoadingPuppy from '../../../../components/loading/LoadingPuppy.vue';
import Selector from '../../../../components/Selector.vue';
import { useFormMode } from '../../../../composables/useFormMode';
import PetSelector from '../../../pets/components/PetSelector.vue';
import { usePets } from '../../../pets/composables/usePets';
import { useAntiparasiticForm } from '../../composables/useAntiparasiticForm';
import { antiparasiteFields } from '../../config';
import LogSuccess from '../LogSuccess.vue';

const { loading, isAddingHealth, healthLoading, selectedLog, selectedPet } = usePets();
const { formData, fillLogData, newLog, handleClose, handleDelete, handleSubmit, antiparasitics, error } = useAntiparasiticForm();
const { t } = useI18n();
const { mode, isReadonly } = useFormMode();
const today = new Date().toISOString().slice(0, 10);
provide('readonly', isReadonly);

const { treated, givenDate, dueDate, other } = antiparasiteFields;

watch(() => selectedLog.antiparasitic, (log) => {
    mode.value = log ? "view" : "edit";
});

watch(() => mode.value, (mode) => {
    if (mode === "view") fillLogData(selectedLog.antiparasitic!)
})
</script>

<template>
    <Transition name="panel">
        <FormWrapper v-if="isAddingHealth.antiparasitic || selectedLog.antiparasitic" :onClose="handleClose">
            <LoadingPuppy v-if="loading || healthLoading" />
            <div class="md:max-w-max" v-else-if="!newLog">
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
                        <Input v-model="formData.givenAt" :id="givenDate.id" :label="t(givenDate.label)"
                            :type="givenDate.type" :max="today" required>
                            <template #addon>
                                <CalendarCheck class="mr-0.5" color="var(--color-brand)" />
                            </template>
                        </Input>
                        <Input v-if="selectedLog.antiparasitic?.dueOn || mode === 'edit'" v-model="formData.dueOn"
                            :id="dueDate.id" :label="t(dueDate.label)" :type="dueDate.type"
                            :min="formData.givenAt || today">
                            <template #addon>
                                <CalendarClock v-if="!formData.dueOn" class="mr-0.5" color="var(--color-border)" />
                                <Button v-else type="button" variant="ghost" size="xs" @click="formData.dueOn = ''">{{
                                    t("common.button.clear") }}</Button>
                            </template>
                        </Input>
                        <Input v-if="selectedLog.antiparasitic?.other || mode === 'edit'" v-model="formData.other"
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
            <LogSuccess v-else-if="newLog" :onClose="handleClose" :pet="selectedPet!" :logged="newLog" />
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