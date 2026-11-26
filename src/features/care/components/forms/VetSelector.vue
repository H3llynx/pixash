<script setup lang="ts">
import { inject, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Dropdown from '../../../../components/Dropdown.vue';
import Input from '../../../../components/Input.vue';
import { usePets } from '../../../pets/composables/usePets.ts';

const { t } = useI18n();
const { vets, selectedVet } = usePets();

withDefaults(defineProps<{
    vet: Record<string, string>,
    required?: boolean
}>(), { required: false });

const vetInputRef = ref<{ focus: () => void } | null>(null);

const readonly = inject("readonly", ref(false));
const model = defineModel<string>();
const vetTextInput = defineModel<boolean>("vetTextInput");

const onVetChange = () => {
    if (model.value === "other") {
        vetTextInput.value = true;
        model.value = ""
    };
};

watch(vetTextInput, async (textInputVisible) => {
    if (textInputVisible) {
        await nextTick();
        vetInputRef.value?.focus();
    }
});
</script>

<template>
    <Dropdown v-if="vets.length && (!vetTextInput || vets.find(v => v.id === model))" v-model="model" :id="vet.id"
        :label="t(vet.label)" @change="onVetChange" :class="(selectedVet || readonly) && 'select-read-only'" required>
        <option v-for="v in vets" :key="v.id" :value="v.id">
            {{ v.name }}
        </option>
        <option value="other">{{ t("health.vet.visitForm.other") }}</option>
    </Dropdown>
    <Input ref="vetInputRef" v-else v-model="model" :id="vet.id" :label="t(vet.label)" :placeholder="t(vet.placeholder)"
        :required="required">
        <template #addon>
            <Button variant="ghost" size="xs" type="button" v-if="!readonly && vets.length"
                @click=" vetTextInput = false; model = selectedVet ? selectedVet.id : vets[0].id">
                {{ t("health.vet.visitForm.chooseExisting") }}
            </Button>
        </template>
    </Input>
</template>