import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

export const useMedia = () => {
    const breakpoints = useBreakpoints(breakpointsTailwind);
    const isMd = breakpoints.greaterOrEqual("md");

    return { isMd };
}