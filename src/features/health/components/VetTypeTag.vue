<script setup lang="ts">
const props = defineProps<{ type: string }>();

const getTagStyle = () => {
    return {
        "tag capitalize": true,
        "primary": props.type === "primary",
    };
};
</script>

<template>
    <span :class="getTagStyle()">{{ type }}</span>
</template>

<style scoped>
.primary {
    background: rgba(79, 147, 190, 0.2);
    color: rgb(93, 144, 175);
}

.emergency {
    background: rgba(226, 75, 74, 0.2);
    color: rgb(163, 45, 45);
}
</style>