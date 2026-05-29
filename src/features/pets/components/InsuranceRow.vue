<script setup lang="ts">
import { reactive, ref, Transition, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import Input from '../../../components/Input.vue';
import Toggle from '../../../components/Toggle.vue';
import { useToast } from '../../../composables/useToast.ts';
import { usePets } from '../composables/usePets.ts';
import type { PetExtended } from '../types.ts';

const props = defineProps<{ pet: PetExtended }>();

const { updateSelectedPet, error } = usePets();
const { show } = useToast();
const { t } = useI18n();

const isInsured = ref<boolean>(false);
const loading = ref<boolean>(false);
const insuranceData = reactive({
    company: "",
    policy: "",
    contact: "",
    web: ""
})


const handleSubmit = async () => {
    if (!isInsured.value) return;
    loading.value = true;
    try {
        await updateSelectedPet(props.pet, { insured: true, insurance: insuranceData });
        show({
            type: "success",
            title: t("toast.success.title.generic"),
            message: t("toast.success.message.petInsuranceUploaded", { name: props.pet.name }),
        });
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: error.value || "" });
    } finally {
        loading.value = false;
    }
};

watch(() => props.pet.insured, (insured) => {
    if (insured) isInsured.value = true;
}, { immediate: true });
</script>

<template>
    <div class="flex flex-col items-end gap-1">
        <Toggle class="w-max text-sm" v-model="isInsured" :label="t('pet.profile.insured')" size="sm" />
        <Transition name="toast">
            <div v-if="isInsured && !pet.insurance">
                <form @submit.prevent="handleSubmit()"
                    class="mini-form rounded-xl border border-dashed border-brand-light p-1 flex flex-col gap-1">
                    <div class="flex gap-0.5 flex-wrap justify-between">
                        <Input v-model="insuranceData.company" id="insurance-company"
                            :label="t('pet.insurance.company')" />
                        <Input v-model="insuranceData.policy" id="insurance-policy"
                            :label="t('pet.insurance.policy')" />
                        <Input v-model="insuranceData.contact" id="insurance-contact" type="tel"
                            :label="t('pet.insurance.contact')" />
                        <Input v-model="insuranceData.web" id="insurance-company" :label="t('pet.insurance.web')" />
                    </div>
                    <Button class="self-end">{{ t("common.button.save") }}</Button>
                </form>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
:deep(input) {
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