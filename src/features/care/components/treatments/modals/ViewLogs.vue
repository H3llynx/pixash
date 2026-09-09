<script setup lang="ts">
import { X } from '@lucide/vue';
import Button from '../../../../../components/Button.vue';
import FreeModal from '../../../../../components/FreeModal.vue';
import type { MedicineDb } from '../../../types.ts';

const props = defineProps<{
    medication: MedicineDb
}>();

const isViewing = defineModel<boolean>();
</script>

<template>
    <FreeModal v-model="isViewing">
        <Button variant="ghost" size="rounded" @click="isViewing = false">
            <X :size="18" />
        </Button>
        Hello
    </FreeModal>
</template>