import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

export const useMedia = () => {
    const breakpoints = useBreakpoints(breakpointsTailwind);
    const isMd = breakpoints.greaterOrEqual("md");
    const isLg = breakpoints.greaterOrEqual("lg");
    const isXl = breakpoints.greaterOrEqual("xl");
    const is2xl = breakpoints.greaterOrEqual("2xl");

    return { isMd, isLg, isXl, is2xl };
}