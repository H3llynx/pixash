<script setup lang="ts">
import { Plus, X } from '@lucide/vue';
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import type { VetExtended } from '../../health/types';
import { usePets } from '../../pets/composables/usePets';

const { updateSelectedVet } = usePets();
const { t } = useI18n();

const props = defineProps<{
    vet: VetExtended
    data: "phone" | "email" | "hours"
}>();

const updateForm = ref<HTMLFormElement>();
const formData = ref<string>();
const isUpdating = ref<boolean>(false);

onClickOutside(updateForm, () => {
    if (isUpdating.value) {
        isUpdating.value = false;
    }
});

const startUpdating = () => {
    isUpdating.value = true;
};

const handleSubmit = async () => {
    if (!formData) return;
    const update = { [props.data]: formData.value }
    await updateSelectedVet(props.vet, update);
};
</script>

<template>
    <div class="flex h-2 gap-[3px]">
        <Button v-if="!isUpdating" @click="startUpdating" variant="summaryCta" size="xxs"
            :aria-label="`Update ${data}`">
            <Plus :size="18" />
        </Button>
        <template v-else>
            <form @submit.prevent="handleSubmit()" @keydown.enter.exact="handleSubmit()"
                :aria-label="t('vet.profile.edit.' + data)" class="profile-mini-form flex gap-0.5" ref="updateForm">
                <input v-model=formData :id="`vet-${data}`" ref="inputRef" class="text-base">
            </form>
            <Button size="xs" variant="ghost" @click="isUpdating = false">
                <X :size="18" color="var(--color-brand-light)" />
            </Button>
        </template>
    </div>
</template>

<style scoped>
input {
    border-radius: 0.5rem;
    padding: 5px 0.5rem;
    font-weight: 500;
}
</style>