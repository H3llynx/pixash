<script setup lang="ts">
import { reactive, ref, Transition, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import Input from '../../../components/Input.vue';
import Toggle from '../../../components/Toggle.vue';
import { useToast } from '../../../composables/useToast.ts';
import { phonePattern } from '../../../config/config.ts';
import { usePets } from '../composables/usePets.ts';
import type { PetExtended } from '../types.ts';

const props = defineProps<{ pet: PetExtended }>();

const { updateSelectedPet, error } = usePets();
const { show } = useToast();
const { t } = useI18n();

const isInsured = ref<boolean>(false);
const loading = ref<boolean>(false);
const isUpdating = ref<boolean>(false);
const insuranceData = reactive({
    company: props.pet.insurance?.company || "",
    policy: props.pet.insurance?.policy || "",
    contact: props.pet.insurance?.contact || "",
    web: props.pet.insurance?.web || "",
});

const toggleInsurance = async () => {
    loading.value = true;
    try {
        if (isInsured.value && !props.pet.insured) await updateSelectedPet(props.pet, { insured: true });
        else if (!isInsured.value && props.pet.insured) await updateSelectedPet(props.pet, { insured: false });
        else return;
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: error.value || "" });
    } finally {
        loading.value = false;
    };
};

const handleSubmit = async () => {
    if (insuranceData === props.pet.insurance || Object.values(insuranceData).every(value => value === "")) return;
    try {
        loading.value = true;
        await updateSelectedPet(props.pet, { insurance: insuranceData });
        show({ type: "success", title: t("toast.success.title.generic"), message: t("toast.success.message.insuranceUpdated", { name: props.pet.name }) });
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: error.value || "" });
    } finally {
        loading.value = false;
        isUpdating.value = false;
    };
};

watch(() => props.pet.insured, (insured) => {
    if (insured) isInsured.value = true;
}, { immediate: true });
</script>

<template>
    <div class="flex flex-col items-end gap-1">
        <Toggle class="w-max text-sm" v-model="isInsured" :label="t('pet.profile.insured')" size="sm"
            :disabled="loading" @change="toggleInsurance" />
        <Button v-if="props.pet.insured" variant="ghost" size="xxs" :aria-label="t('pet.profile.insurance.update')"
            @click="isUpdating = true" :disabled="loading">
            {{ t('pet.insurance.update') }}
        </Button>
        <Transition name="toast">
            <form v-if="isUpdating" class="flex gap-0.5 flex-wrap w-full" @submit.prevent="handleSubmit">
                <Input v-model="insuranceData.company" :label="t('pet.insurance.company')" />
                <Input v-model="insuranceData.policy" :label="t('pet.insurance.policy')" />
                <Input v-model="insuranceData.contact" type="tel" :label="t('pet.insurance.contact')"
                    :pattern="phonePattern" />
                <Input v-model="insuranceData.web" type="url" :label="t('pet.insurance.web')" />
                <Button size="xxs" class="px-1 ml-auto mt-0.5">{{ t('common.button.save') }}</Button>
            </form>
        </Transition>
    </div>
</template>

<style scoped>
:deep(input:not([type="checkbox"])) {
    border-radius: 0.5rem;
    padding: 5px 0.5rem;
    font-weight: 500;
}

@media (width >=40rem) {
    :deep(form label) {
        width: 48%;

        p {
            font-size: small;
            font-weight: 500;
            color: var(--color-brand);
        }
    }
}
</style>