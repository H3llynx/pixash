<script setup lang="ts">
import { Mail } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import { useMedia } from '../../../composables/useMedia';
import type { VetExtended } from '../types';
import AddVetDetail from './forms/AddVetDetail.vue';

const { t } = useI18n();
const { isMd } = useMedia();

const props = defineProps<{
    vet: VetExtended
    data: "phone" | "email" | "hours"
}>();

const handleMail = () => {
    if (!props.vet.email) return;
    window.location.href = `mailto:${props.vet.email}`;
}
</script>

<template>
    <div class="profile-row">
        <span>{{ t("vet.label." + data) }}</span>
        <template v-if="data === 'email'">
            <Button v-if="vet[data]" variant="ghost" size="xs" class="truncate" @click="handleMail"
                :aria-label="t('vet.cta.email', { name: vet.name })">
                <Mail :size="16" class="shrink-0" />
                <span :class="{ 'text-sm': isMd, truncate: true }">{{ vet.email }}</span>
            </Button>
            <AddVetDetail data="email" :vet="vet" v-else />
        </template>
        <template v-else-if="data === 'phone'">
            <span v-if="vet.phone" class="text-blue font-medium">{{ vet.phone }}</span>
            <AddVetDetail data="phone" :vet="vet" v-else />
        </template>
        <template v-else-if="data === 'hours'">
            <span v-if="vet.hours" class="text-sm text-right">{{ vet.hours }}</span>
            <AddVetDetail data="hours" :vet="vet" v-else />
        </template>
    </div>
</template>