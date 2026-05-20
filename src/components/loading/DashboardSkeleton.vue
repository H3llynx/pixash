<script setup lang="ts">
import EventCardSkeleton from './EventCardSkeleton.vue';
</script>

<template>
    <div
        class="animate-pulse overflow-hidden flex-1 flex flex-col gap-1.5 md:pl-18 pb-6.5 md:pb-1 lg:grid lg:grid-cols-[55%_45%] lg:gap-0">
        <!-- Pet switcher chips -->
        <div class="flex gap-0.5 md:hidden default-padding">
            <div class="h-2 w-5 rounded-full bg-grey-light opacity-30"></div>
            <div class="h-2 w-5 rounded-full bg-grey-light opacity-20"></div>
        </div>

        <div class="flex flex-col gap-1.5 default-padding">
            <!-- Stat row -->
            <div class="flex gap-0.5 md:gap-1 md:h-6">
                <div v-for="i in 2" :key="i"
                    class="bg-bg-2 border border-border rounded-xl p-1 flex flex-col gap-0.5 w-1/2 md:w-1/3 min-w-11">
                    <div class="h-0.75 w-2/3 rounded bg-grey-light opacity-30"></div>
                    <div class="h-1.25 w-2/3 rounded bg-grey-light opacity-30"></div>
                    <div class="h-0.75 w-1/3 rounded-full bg-grey-light opacity-20"></div>
                </div>
            </div>

            <!-- Pet profile card -->
            <div class="flex flex-col gap-1 w-full">
                <div class="h-1 w-7 rounded bg-grey-light opacity-30"></div>
                <div class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 w-full">
                    <div class="flex items-center relative">
                        <div class="rounded-full w-4 aspect-square bg-grey-light opacity-30 min-w-2"></div>
                        <div class="px-1 flex flex-col gap-0.5 w-full">
                            <div class="h-1.5 w-1/3 rounded bg-grey-light opacity-30"></div>
                            <div class="h-[10px] w-1/2 rounded bg-grey-light opacity-20"></div>
                            <div class="h-[10px] w-1/2 rounded bg-grey-light opacity-20"></div>
                        </div>
                        <div class="h-1.25 w-1.25 rounded bg-grey-light opacity-20 absolute right-0 top-0 shrink-0">
                        </div>
                    </div>
                    <div class="h-1.5 w-full rounded-lg bg-grey-light opacity-20 mt-1"></div>
                </div>
            </div>

            <!-- Active treatment -->
            <div class="flex flex-col gap-1 w-full">
                <div class="h-1 w-7 rounded bg-grey-light opacity-30"></div>
                <div class="flex flex-col gap-0.5 p-1 rounded-xl border border-border bg-bg-2 w-full">
                    <div class="flex items-center justify-between">
                        <div class="h-1.25 w-1/3 rounded bg-grey-light opacity-20 shrink-0">
                        </div>
                        <div class="h-1.25 w-1.25 rounded bg-grey-light opacity-20 shrink-0">
                        </div>
                    </div>
                    <div class="h-[10px] w-1/2 rounded bg-grey-light opacity-20"></div>
                    <div class="flex gap-0.5 mt-1">
                        <div class="h-1.25 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-1.25 w-2.25 rounded-lg bg-grey-light opacity-20 shrink-0">
                        </div>
                    </div>
                    <div class="flex gap-0.5">
                        <div class="h-2 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-2 w-full rounded-lg bg-grey-light opacity-20"></div>
                    </div>
                    <div class="flex gap-0.5 mt-1">
                        <div class="h-1.25 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-1.25 w-2.25 rounded-lg bg-grey-light opacity-20 shrink-0"></div>
                    </div>
                    <div class="flex gap-0.5">
                        <div class="h-2 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-2 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-2 w-full rounded-lg bg-grey-light opacity-20"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Upcoming events -->
        <div class="default-padding flex flex-col gap-1.5 lg:px-1.5">
            <div>
                <div class="h-1 w-7 rounded bg-grey-light opacity-30 flex mb-1"></div>
                <div class="flex flex-col gap-1">
                    <EventCardSkeleton v-for="i in 2" :key="i" />
                </div>
            </div>
            <div>
                <div class="h-1 w-7 rounded bg-grey-light opacity-30 mb-1"></div>
                <div class="flex flex-col gap-2.5 px-1 pt-1 rounded-xl border border-border bg-bg-2 w-full">
                    <div class="flex gap-0.5 justify-between">
                        <div class="h-2 w-5 rounded-full bg-grey-light opacity-30"></div>
                        <div class="h-2 w-6 rounded-lg bg-grey-light opacity-20 shrink-0"></div>
                    </div>
                    <div class="flex gap-0.5 justify-between items-end">
                        <div class="w-1/5 h-4 rounded-t-xl bg-grey-light opacity-30"></div>
                        <div class="w-1/5 h-5 rounded-t-xl bg-grey-light opacity-30"></div>
                        <div class="w-1/5 h-5 rounded-t-xl bg-grey-light opacity-30"></div>
                        <div class="w-1/5 h-4.5 rounded-t-xl bg-grey-light opacity-30"></div>
                        <div class="w-1/5 h-5 rounded-t-xl bg-grey-light opacity-30"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>