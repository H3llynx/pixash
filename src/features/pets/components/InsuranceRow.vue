<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
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

watch(() => props.pet.insured, (insured) => {
    if (insured) isInsured.value = true;
}, { immediate: true });
</script>

<template>
    <div class="flex flex-col items-end gap-1">
        <Toggle class="w-max text-sm" v-model="isInsured" :label="t('pet.profile.insured')" size="sm"
            :disabled="loading" @change="toggleInsurance" />
        <Button v-if="props.pet.insured" variant="ghost" size="xxs" :aria-label="t('pet.profile.insurance.update')"
            @click="toggleInsurance" :disabled="loading">
            {{ t('pet.insurance.update') }}
        </Button>
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