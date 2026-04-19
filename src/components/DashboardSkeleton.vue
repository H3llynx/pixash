<script setup lang="ts">
import { useMedia } from '../composables/useMedia';

const { isMd } = useMedia();
</script>

<template>
    <div class="animate-pulse flex flex-col gap-1 default-padding py-1">

        <!-- Pet switcher chips -->
        <div class="flex gap-0.5 md:hidden">
            <div class="h-2 rounded-full bg-grey-light opacity-30"></div>
            <div class="h-2 rounded-full bg-grey-light opacity-20"></div>
        </div>

        <!-- Stat row -->
        <div class="grid grid-cols-2 gap-1 md:max-w-xl md:h-6">
            <div class="bg-bg-2 border border-border rounded-xl p-0.75 space-y-0.25">
                <div class="h-[10px] w-4 rounded bg-grey-light opacity-30"></div>
                <div class="h-1.25 w-3 rounded bg-grey-light opacity-30"></div>
                <div class="h-[10px] w-5 rounded bg-grey-light opacity-20"></div>
            </div>
            <div class="bg-bg-2 border border-border rounded-xl p-0.75 space-y-0.25">
                <div class="h-[10px] w-4 rounded bg-grey-light opacity-30"></div>
                <div class="h-1.25 w-3 rounded bg-grey-light opacity-30"></div>
                <div class="h-[10px] w-5 rounded bg-grey-light opacity-20"></div>
            </div>
        </div>

        <!-- Pet profile card -->
        <div class="h-[10px] w-7 rounded bg-grey-light opacity-30"></div>
        <div class="flex gap-1 max-w-2xl">
            <div class="bg-bg-2 border border-border rounded-2xl p-0.75 space-y-0.5 w-full md:w-1/2 md:h-15">
                <div class="flex items-center gap-0.75">
                    <div class="h-3 w-3 rounded-full bg-grey-light opacity-30 shrink-0"></div>
                    <div class="space-y-0.25 flex-1">
                        <div class="h-[14px] w-6 rounded bg-grey-light opacity-30"></div>
                        <div class="h-[10px] w-4 rounded bg-grey-light opacity-20"></div>
                    </div>
                    <div class="h-[22px] w-3.5 rounded-full bg-grey-light opacity-20"></div>
                </div>
                <div class="space-y-0.25">
                    <div class="h-[10px] w-full rounded bg-grey-light opacity-20"></div>
                    <div class="h-[10px] w-full rounded bg-grey-light opacity-20"></div>
                    <div class="h-[10px] w-3/4 rounded bg-grey-light opacity-20"></div>
                </div>
            </div>

            <div v-if="isMd" class="bg-bg-2 border border-border rounded-2xl p-0.75 space-y-0.5 md:w-1/2 md:h-15">
                <div class="flex items-center gap-0.75">
                    <div class="h-3 w-3 rounded-full bg-grey-light opacity-30 shrink-0"></div>
                    <div class="space-y-0.25 flex-1">
                        <div class="h-[14px] w-6 rounded bg-grey-light opacity-30"></div>
                        <div class="h-[10px] w-4 rounded bg-grey-light opacity-20"></div>
                    </div>
                    <div class="h-[22px] w-3.5 rounded-full bg-grey-light opacity-20"></div>
                </div>
                <div class="space-y-0.25">
                    <div class="h-[10px] w-full rounded bg-grey-light opacity-20"></div>
                    <div class="h-[10px] w-full rounded bg-grey-light opacity-20"></div>
                    <div class="h-[10px] w-3/4 rounded bg-grey-light opacity-20"></div>
                </div>
            </div>
        </div>

        <!-- Upcoming events -->
        <div class="space-y-1 md:max-w-md">
            <div class="h-[10px] w-7 rounded bg-grey-light opacity-30"></div>
            <div v-for="i in 2" :key="i"
                class="bg-bg-2 border border-border rounded-xl p-0.75 flex items-start gap-0.75 md:h-5">
                <div class="h-full w-0.25 rounded-full bg-grey-light opacity-30 shrink-0"></div>
                <div class="space-y-0.25 flex-1">
                    <div class="h-0.75 w-8 rounded bg-grey-light opacity-30"></div>
                    <div class="h-[10px] w-6 rounded bg-grey-light opacity-20"></div>
                </div>
                <div class="h-3 w-3 rounded-full bg-grey-light opacity-30 shrink-0"></div>
            </div>
        </div>

    </div>
</template>