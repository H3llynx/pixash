<script setup lang="ts">
import { Pencil } from '@lucide/vue';
import { reactive, ref, Transition, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import Input from '../../../components/Input.vue';
import Toggle from '../../../components/Toggle.vue';
import { useDialog } from '../../../composables/useDialog.ts';
import { useToast } from '../../../composables/useToast.ts';
import { phonePattern } from '../../../config/config.ts';
import { shallowEqual } from '../../../utils.ts';
import { usePets } from '../composables/usePets.ts';

const { updateSelectedPet, error, selectedPet } = usePets();
const { show } = useToast();
const { t } = useI18n();
const { open } = useDialog();

const isInsured = ref<boolean>(false);
const loading = ref<boolean>(false);
const isUpdating = ref<boolean>(false);

const insuranceData = reactive({
    company: "",
    policy: "",
    contact: "",
    web: "",
});

const toggleInsurance = async () => {
    if (!selectedPet.value) return;
    loading.value = true;
    try {
        if (isInsured.value && !selectedPet.value?.insured) await updateSelectedPet(selectedPet.value, { insured: true });
        else if (!isInsured.value && selectedPet.value?.insured) {
            open({
                title: t("dialog.deleteInsurance.title"),
                message: t("dialog.deleteGenericMsg"),
                isDelete: true,
                onConfirm: async () => {
                    await updateSelectedPet(selectedPet.value!, { insured: false, insurance: null })
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.insuranceDeleted"),
                    });
                }
            });
            isInsured.value = true;
        }
        else return;
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: error.value || "" });
    } finally {
        loading.value = false;
    };
};

const handleSubmit = async () => {
    if (!selectedPet.value) return
    if (selectedPet.value.insurance && shallowEqual(insuranceData, selectedPet.value.insurance)) return;
    try {
        loading.value = true;
        if (Object.values(insuranceData).every(value => value === "")) await updateSelectedPet(selectedPet.value, { insurance: null });
        else await updateSelectedPet(selectedPet.value, { insurance: { ...insuranceData } });
        show({ type: "success", title: t("toast.success.title.generic"), message: t("toast.success.message.insuranceUpdated", { name: selectedPet.value.name }) });
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: error.value || "" });
    } finally {
        loading.value = false;
        isUpdating.value = false;
    }
};

watch(() => selectedPet.value?.insured, (insured) => {
    isInsured.value = insured ? true : false;
}, { immediate: true });

watch(() => selectedPet.value?.insurance, (insurance) => {
    if (insurance) Object.assign(insuranceData, insurance);
}, { immediate: true });
</script>

<template>
    <div class="flex flex-col items-end gap-1">
        <div class="flex flex-row-reverse items-center gap-0.75">
            <Toggle class="w-max text-sm" v-model="isInsured" :label="t('pet.profile.labels.insured')" size="sm"
                :disabled="loading" @change="toggleInsurance" />
            <Button v-if="selectedPet?.insured" variant="tertiary" size="xxs" :aria-label="t('pet.insurance.update')"
                @click="isUpdating = true" :disabled="loading">
                <Pencil :size="14" />
                {{ t('pet.insurance.update') }}
            </Button>
        </div>
        <Transition name="toast">
            <form v-if="isUpdating" class="flex gap-0.5 flex-wrap w-full text-sm" @submit.prevent="handleSubmit">
                <Input v-model="insuranceData.company" :label="t('pet.insurance.company')" />
                <Input v-model="insuranceData.policy" :label="t('pet.insurance.policy')" />
                <Input v-model="insuranceData.contact" type="tel" :label="t('pet.insurance.contact')"
                    :pattern="phonePattern" />
                <Input v-model="insuranceData.web" type="url" :label="t('pet.insurance.web')" />
                <div class="flex gap-0.5 ml-auto mt-0.5">
                    <Button :disabled="loading" type="button" variant="secondary" size="sm"
                        @click="isUpdating = false">{{
                            t('common.button.cancel') }}</Button>
                    <Button size="sm" :disabled="loading">{{ t('common.button.save') }}</Button>
                </div>
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