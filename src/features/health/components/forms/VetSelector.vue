<script setup lang="ts">
import { inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Dropdown from '../../../../components/Dropdown.vue';
import Input from '../../../../components/Input.vue';
import { usePets } from '../../../pets/composables/usePets';

const { t } = useI18n();
const { vets, selectedVet } = usePets();

withDefaults(defineProps<{
    vet: Record<string, string>,
    required?: boolean
}>(), { required: false });

const readonly = inject("readonly", ref(false));
const model = defineModel<string>();
const vetTextInput = defineModel<boolean>('vetTextInput');

const onVetChange = () => {
    if (model.value === "other") {
        vetTextInput.value = true;
        model.value = ""
    };
}
</script>

<template>
    <Dropdown v-if="vets.length && !vetTextInput" v-model="model" :id="vet.id" :label="t(vet.label)"
        @change="onVetChange" :class="(selectedVet || readonly) && 'pointer-events-none focus-visible:outline-0'"
        @keydown.enter="readonly && $event.preventDefault()" required>
        <option v-for="v in vets" :key="v.id" :value="v.id">
            {{ v.name }}
        </option>
        <option value="other">{{ t("health.vetVisitForm.other") }}</option>
    </Dropdown>
    <Input v-else v-model="model" :id="vet.id" :label="t(vet.label)" :placeholder="t(vet.placeholder)"
        :required="required">
        <template #addon>
            <Button variant="ghost" size="xs" type="button" v-if="!readonly"
                @click="vetTextInput = false; model = selectedVet ? selectedVet.id : vets[0].id">
                {{ t("health.vetVisitForm.chooseExisting") }}
            </Button>
        </template>
    </Input>
</template>