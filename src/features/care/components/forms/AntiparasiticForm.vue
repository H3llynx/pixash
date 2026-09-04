<script setup lang="ts">
import { CalendarCheck, CalendarClock } from '@lucide/vue';
import { provide, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Input from '../../../../components/Input.vue';
import LoadingPuppy from '../../../../components/loading/LoadingPuppy.vue';
import Panel from '../../../../components/Panel.vue';
import Selector from '../../../../components/Selector.vue';
import Toggle from '../../../../components/Toggle.vue';
import { useFormMode } from '../../../../composables/useFormMode.ts';
import { todayAsInput } from '../../../../utils.ts';
import PetIcon from '../../../pets/components/PetIcon.vue';
import PetSelector from '../../../pets/components/PetSelector.vue';
import { usePets } from '../../../pets/composables/usePets.ts';
import { antiparasiteFields } from '../../config.ts';
import LogSuccess from '../LogSuccess.vue';
import ButtonArea from './ButtonArea.vue';
import { useAntiparasiticForm } from './composables/useAntiparasiticForm.ts';

const { isAddingCare, selectedAntiparasiticLog, selectedPet } = usePets();
const { loading, formData, fillLogData, newLog, handleClose, handleDelete, handleSubmit, antiparasitics, error } = useAntiparasiticForm();
const { t } = useI18n();
const { mode, isReadonly } = useFormMode();
provide('readonly', isReadonly);

const { treated, notGiven, givenDate, dueDate, notes } = antiparasiteFields;

watch(() => isAddingCare.antiparasitic, (adding) => {
    if (adding) mode.value = "edit";
});

watch(() => selectedAntiparasiticLog.value, (log) => {
    mode.value = log ? "view" : "edit";
});

watch(() => mode.value, (mode) => {
    if (mode === "view") fillLogData(selectedAntiparasiticLog.value!)
})
</script>

<template>
    <Transition name="panel">
        <Panel v-if="isAddingCare.antiparasitic || selectedAntiparasiticLog" :onClose="handleClose">
            <LoadingPuppy v-if="loading" />
            <div class="md:max-w-max" v-else-if="!newLog">
                <div class="flex gap-1 justify-between my-1 default-padding items-center">
                    <div v-if="selectedAntiparasiticLog && selectedPet"
                        class="rounded-full w-3 h-3 text-3xl flex shrink-0 justify-center items-center">
                        <PetIcon :pet="selectedPet" />
                    </div>
                    <h1 v-if="mode === 'edit'">{{ t("health.title.logAntiparasitic") }}</h1>
                    <h1 v-else class="font-medium">{{ selectedPet!.name }} · {{ t("health.antiparasiteForm.viewTitle")
                        }}
                    </h1>
                    <Button v-if="selectedAntiparasiticLog" action="delete"
                        :aria-label="t('health.cta.deleteAntiparasitic')" @click="handleDelete" />
                </div>
                <PetSelector v-if="isAddingCare.antiparasitic" stacked />
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
                        <Input v-if="!formData.notGiven" v-model="formData.givenAt" :id="givenDate.id"
                            :label="t(givenDate.label)" :type="givenDate.type" :max="todayAsInput()" required>
                            <template #addon>
                                <CalendarCheck class="mr-0.5" color="var(--color-border)" />
                            </template>
                        </Input>
                        <Toggle v-if="mode === 'edit'" v-model="formData.notGiven"
                            :label="t(notGiven.label, { name: selectedPet!.name })" :id="notGiven.id" />
                        <Input v-if="selectedAntiparasiticLog?.dueOn || mode === 'edit'" v-model="formData.dueOn"
                            :id="dueDate.id" :label="t(dueDate.label)" :type="dueDate.type"
                            :min="formData.givenAt || todayAsInput()" :required="!formData.givenAt">
                            <template #addon>
                                <CalendarClock v-if="!formData.dueOn" class="mr-0.5" color="var(--color-border)" />
                                <Button v-else type="button" variant="ghost" size="xs" @click="formData.dueOn = ''">{{
                                    t("common.button.clear") }}</Button>
                            </template>
                        </Input>
                        <Input v-if="selectedAntiparasiticLog?.notes || mode === 'edit'" v-model="formData.notes"
                            :id="notes.id" :label="t(notes.label)" :type="notes.type"
                            :placeholder="t(notes.placeholder)" />
                        <ButtonArea v-model="mode" :loading="loading" :selectedCare="(selectedAntiparasiticLog)"
                            :customCta="t('health.cta.logTreatment')" />
                    </div>
                </form>
            </div>
            <LogSuccess v-else-if="newLog" :onClose="handleClose" :pet="selectedPet!" :log="newLog" />
        </Panel>
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

:deep(label:has(input[type="checkbox"]:checked)) p {
    background: var(--color-accent-rgba);
    border-color: var(--color-accent);
    color: var(--color-accent);
    font-weight: 500;
}
</style>