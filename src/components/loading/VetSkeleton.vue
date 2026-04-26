<script setup lang="ts">
import { useMedia } from '../../composables/useMedia';

const { isMd } = useMedia();
</script>

<template>
    <div class="animate-pulse flex flex-col gap-1 default-padding py-1">
        <div class="h-[10px] w-7 rounded bg-grey-light opacity-30"></div>
        <div class="flex gap-1 max-w-2xl">
            <div class="bg-bg-2 border border-border rounded-2xl p-0.75 space-y-0.5 w-full md:w-1/2">
                <div class="flex items-center gap-0.75">
                    <div class="h-3 w-3 rounded-xl bg-grey-light opacity-30 shrink-0"></div>
                    <div class="space-y-0.25 flex-1">
                        <div class="h-[14px] w-6 rounded bg-grey-light opacity-30"></div>
                        <div class="h-[10px] w-4 rounded bg-grey-light opacity-20"></div>
                    </div>
                </div>
                <div class="flex gap-0.5 mt-1">
                    <div class="h-1 w-2.5 rounded-full bg-grey-light opacity-30"></div>
                    <div class="h-1 w-2.5 rounded-full bg-grey-light opacity-20"></div>
                </div>
                <div class="my-1 space-y-1">
                    <div class="h-[10px] w-full rounded bg-grey-light opacity-20"></div>
                    <div class="h-[10px] w-full rounded bg-grey-light opacity-20"></div>
                    <div class="h-[10px] w-full rounded bg-grey-light opacity-20"></div>
                </div>
                <div class="h-2 w-full rounded-xl bg-grey-light opacity-20 mt-1"></div>
                <div class="h-3 w-full rounded-xl bg-grey-light opacity-20 mt-1"></div>
                <div class="h-px w-full rounded bg-grey-light opacity-20 mt-1"></div>
                <div class="flex gap-1">
                    <div v-for="i in 3" :key=i class="h-3 flex-1 rounded-xl bg-grey-light opacity-30 shrink-0">
                    </div>
                </div>
            </div>
            <div v-if="isMd" class="bg-bg-2 border border-border rounded-2xl p-0.75 space-y-0.5 w-full md:w-1/2">
                <div class="flex items-center gap-0.75">
                    <div class="h-3 w-3 rounded-xl bg-grey-light opacity-30 shrink-0"></div>
                    <div class="space-y-0.25 flex-1">
                        <div class="h-[14px] w-6 rounded bg-grey-light opacity-30"></div>
                        <div class="h-[10px] w-4 rounded bg-grey-light opacity-20"></div>
                    </div>
                </div>
                <div class="flex gap-0.5 mt-1">
                    <div class="h-1 w-2.5 rounded-full bg-grey-light opacity-30"></div>
                    <div class="h-1 w-2.5 rounded-full bg-grey-light opacity-20"></div>
                </div>
                <div class="my-1 space-y-1">
                    <div class="h-[10px] w-full rounded bg-grey-light opacity-20"></div>
                    <div class="h-[10px] w-full rounded bg-grey-light opacity-20"></div>
                    <div class="h-[10px] w-full rounded bg-grey-light opacity-20"></div>
                </div>
                <div class="h-2 w-full rounded-xl bg-grey-light opacity-20 mt-1"></div>
                <div class="h-3 w-full rounded-xl bg-grey-light opacity-20 mt-1"></div>
                <div class="h-px w-full rounded bg-grey-light opacity-20 mt-1"></div>
                <div class="flex gap-1">
                    <div v-for="i in 3" :key=i class="h-3 flex-1 rounded-xl bg-grey-light opacity-30 shrink-0">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>