<script setup lang="ts">
import { useMedia } from '../../composables/useMedia';

const { isMd } = useMedia();
</script>

<template>
    <div class="animate-pulse flex flex-col gap-1.5 default-padding py-1 max-w-full overflow-hidden">

        <!-- Pet switcher chips -->
        <div class="flex gap-0.5 md:hidden">
            <div class="h-2 w-5 rounded-full bg-grey-light opacity-30"></div>
            <div class="h-2 w-5 rounded-full bg-grey-light opacity-20"></div>
        </div>

        <!-- Stat row -->
        <div class="grid grid-cols-2 gap-1 md:max-w-xl md:h-6">
            <div v-for="i in 2" :key="i" class="bg-bg-2 border border-border rounded-xl p-0.75 space-y-0.25">
                <div class="h-[10px] w-4 rounded bg-grey-light opacity-30"></div>
                <div class="h-1.25 w-3 rounded bg-grey-light opacity-30"></div>
                <div class="h-[10px] w-5 rounded bg-grey-light opacity-20"></div>
            </div>
        </div>

        <!-- Pet profile card -->
        <div class="h-[10px] w-7 rounded bg-grey-light opacity-30"></div>
        <div class="flex gap-1 w-full">
            <div
                class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 md:w-sm w-full h-20 md:shrink-0 md:h-15">
                <div class="flex items-center gap-1">
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

            <div v-if="isMd"
                class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 w-sm shrink-0 h-15">
                <div class="flex items-center gap-1">
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
                class="bg-bg-2 border border-border rounded-xl space-y-0.25 p-1 mb-1 w-full md:max-w-md flex justify-between">
                <div>
                    <div class="h-1 w-16 rounded bg-grey-light opacity-30 mb-0.5"></div>
                    <div class="h-[10px] w-6 rounded bg-grey-light opacity-30"></div>
                </div>
                <div>
                    <div class="h-3 w-3 rounded-full bg-grey-light opacity-30 m-auto"></div>
                    <div class="h-[6px] w-2.5 mt-0.5 rounded bg-grey-light opacity-30 m-auto"></div>
                </div>
            </div>
        </div>

    </div>
</template>