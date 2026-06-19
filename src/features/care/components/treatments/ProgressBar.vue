<script setup lang="ts">

defineProps<{ progress: number, color: string }>();

</script>

<template>
    <div class="flex gap-0.5 items-center">
        <div class="w-full h-0.5 bg-separator rounded overflow-hidden">
            <div class="w-full h-full" :style="{
                width: `${progress}%`,
                backgroundColor: color
            }"></div>
        </div>
        <span>{{ progress }}%</span>
    </div>
</template>