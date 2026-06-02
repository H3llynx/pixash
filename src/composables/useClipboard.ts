import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export const useClipboard = () => {
    const { t } = useI18n();
    const clipboardText = ref<string | null>(null);

    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text)
            .then(() => clipboardText.value = t("common.text.copied"))
            .catch(() => clipboardText.value = t("common.text.errorCopy"))
    };

    watch(() => clipboardText.value, (clipboard) => {
        if (clipboard) setTimeout(() => clipboardText.value = null, 2000)
    });

    return { copyToClipboard, clipboardText };
}