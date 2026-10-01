import { computed, ref, watch, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { usePets } from "../../../../pets/composables/usePets.ts";
import { catBodyRegions, dogBodyRegions } from "../../../../pets/config";
import type { BodyRegion, LumpPosition } from "../types.ts";

export const useBodyMap = (model: LumpPosition, readonly: Ref<boolean>) => {
    const { selectedLump, selectedPet } = usePets();
    const { t, locale } = useI18n();

    const currentZoom = ref<number>(1);
    const svgRef = ref<SVGSVGElement | null>(null);
    const pin = ref<SVGCircleElement | null>(null);
    const locationText = ref<string>(t("health.lumpForm.bodyRegions.instructions"));

    let lastNearest: BodyRegion | null = null;

    const viewBoxBySpecies = {
        minX: 0,
        minY: 150,
        w: 1024,
        h: 700,
    } as const;

    const wrapperStyle = computed(() => {
        const flipX = model.side === "right" ? -1 : 1;
        return {
            transform: `scale(${currentZoom.value}) scaleX(${flipX})`,
        };
    });

    const zoom = (factor: number) => {
        currentZoom.value = Math.min(2.5, Math.max(1, currentZoom.value * factor));
    };

    const getNearestBodyRegion = (
        species: "dog" | "cat",
        x: number,
        y: number
    ): BodyRegion => {
        const regions = species === "dog" ? dogBodyRegions : catBodyRegions;
        let nearest = regions[0];
        let bestDist = Infinity;
        for (const r of regions) {
            const d = Math.hypot(r.x - x, r.y - y);
            if (d < bestDist) { bestDist = d; nearest = r; }
        }
        return nearest;
    };

    const placePin = (x: number, y: number) => {
        if (!pin.value || !selectedPet.value) return;
        pin.value.setAttribute("cx", String(x));
        pin.value.setAttribute("cy", String(y));
        pin.value.setAttribute("r", "14");
        lastNearest = getNearestBodyRegion(selectedPet.value.species as "dog" | "cat", x, y);
        model.x = x;
        model.y = y;
        updateReadout();
    };

    const select = (e: MouseEvent) => {
        if (readonly.value || !svgRef.value || !selectedPet.value) return;
        const rect = svgRef.value.getBoundingClientRect();
        let xPct = (e.clientX - rect.left) / rect.width;
        const yPct = (e.clientY - rect.top) / rect.height;
        if (model.side === "right") {
            xPct = 1 - xPct;
        };
        const px = viewBoxBySpecies.minX + xPct * viewBoxBySpecies.w;
        const py = viewBoxBySpecies.minY + yPct * viewBoxBySpecies.h;
        placePin(px, py);
    };

    const updateReadout = () => {
        if (!lastNearest) {
            locationText.value = t("health.lumpForm.bodyRegions.instructions");
            return;
        }
        locationText.value = `📍 ${t(`health.lumpForm.bodyRegions.${lastNearest.id}.${model.side}`)}`;
    };

    const getReadoutStyle = () => {
        return {
            "text-sm my-0.5 text-accent": true,
            "text-text-secondary": locationText.value === t("health.lumpForm.bodyRegions.instructions")
        }
    };

    watch(() => [model.side, locale.value, readonly.value], () => {
        updateReadout();
    });

    watch(() => readonly.value, (readonly) => {
        if (readonly && selectedLump.value) {
            model.side = selectedLump.value!.location.side;
            placePin(selectedLump.value.location.x, selectedLump.value.location.y);
            currentZoom.value = 1;
        };
    });

    return {
        currentZoom,
        svgRef,
        wrapperStyle,
        pin,
        locationText,
        zoom,
        getNearestBodyRegion,
        placePin,
        select,
        getReadoutStyle,
    }
}