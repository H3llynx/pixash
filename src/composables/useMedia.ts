import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

export const useMedia = () => {
    const breakpoints = useBreakpoints(breakpointsTailwind);
    const isMd = breakpoints.greaterOrEqual("md");
    const is2xl = breakpoints.greaterOrEqual("2xl");

    return { isMd, is2xl };
}