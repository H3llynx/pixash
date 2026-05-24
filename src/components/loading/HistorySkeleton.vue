<script setup lang="ts">
import EventCardSkeleton from './EventCardSkeleton.vue';

</script>

<template>
    <div
        class="animate-pulse flex flex-col gap-1.5 default-padding py-1 max-w-full overflow-hidden pb-6 md:pl-21 lg:grid lg:grid-cols-[55%_45%] lg:gap-0 md:pb-1">
        <div class="flex flex-col gap-1.5">
            <!-- Event type switcher chips -->
            <div class="flex gap-0.5">
                <div class="h-2 w-5 rounded-full bg-grey-light opacity-30"></div>
                <div class="h-2 w-5 rounded-full bg-grey-light opacity-20"></div>
                <div class="h-2 w-5 rounded-full bg-grey-light opacity-30"></div>
                <div class="h-2 w-5 rounded-full bg-grey-light opacity-20"></div>
            </div>
            <!-- Upcoming events -->
            <div class="flex flex-col gap-1">
                <EventCardSkeleton v-for="i in 4" :key="i" />
            </div>
        </div>
        <div class="flex flex-col gap-1.5 pb-1 lg:px-1.5 lg:pt-1.5 lg:h-full">
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
                    <div class="flex gap-0.5 mt-0.5">
                        <div class="h-1.25 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-1.25 w-2.25 rounded-lg bg-grey-light opacity-20 shrink-0"></div>
                    </div>
                </div>
            </div>
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
                    <div class="flex gap-0.5 mt-0.5">
                        <div class="h-1.25 w-full rounded-lg bg-grey-light opacity-20"></div>
                        <div class="h-1.25 w-2.25 rounded-lg bg-grey-light opacity-20 shrink-0"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>