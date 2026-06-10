<script setup lang="ts">
import { CalendarCheck } from '@lucide/vue';
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Input from '../../../../components/Input.vue';
import Panel from '../../../../components/Panel.vue';
import Selector from '../../../../components/Selector.vue';
import { useFormMode } from '../../../../composables/useFormMode.ts';
import { tsToDate } from '../../../../utils.ts';
import { useEvents } from '../../../health/composables/useEvents.ts';
import { usePets } from '../../composables/usePets.ts';
import { logFields } from '../../config.ts';
import type { OtherLogExtended } from '../../types.ts';

const { isAddingLog, selectedOtherLog } = usePets();
const { selectedDate } = useEvents();
const { t } = useI18n();
const { mode, isReadonly } = useFormMode();
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
    isAddingLog.value = false;
    selectedOtherLog.value = null;
};
const handleSubmit = () => { };

watch(() => isAddingLog, (adding) => {
    if (adding) mode.value = "edit";
});

watch(() => selectedOtherLog.value, (log) => {
    mode.value = log ? "view" : "edit";
});

watch(() => mode.value, (mode) => {
    if (mode === "view") fillLogData(selectedOtherLog.value!);
})
</script>

<template>
    <Transition name="panel">
        <Panel v-if="isAddingLog || selectedOtherLog" :onClose="handleClose">
            <LoadingPuppy v-if="loading" />
            <form v-else @submit.prevent="handleSubmit">
                <Selector :legend="t(subtype.label)">
                    <Input v-model="formData.subtype" v-for="option in subtype.options" :id="option.id"
                        :value="option.id" :key="option.id" :label="t(option.label)" :type="subtype.type" />
                </Selector>
                <Input v-model="formData.date" :id="date.id" :label="t(date.label)" :type="date.type"
                    :class="mode === 'view'" required>
                    <template #addon>
                        <CalendarCheck class=" mr-0.5" color="var(--color-border)" />
                    </template>
                </Input>
                <label :for="notes.id" v-if="selectedOtherLog?.notes || mode === 'edit'">
                    <p>{{ t(notes.label) }}</p>
                    <Textarea v-model="formData.notes" :id="notes.id" :readonly="!!selectedOtherLog && mode === 'view'"
                        :placeholder="t(notes.placeholder)" :maxLength="500" />
                </label>
            </form>
        </Panel>
    </Transition>
</template>