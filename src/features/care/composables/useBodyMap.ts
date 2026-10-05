import { computed, reactive, ref, watch, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { usePets } from "../../pets/composables/usePets.ts";
import type { BodyRegion, LumpPosition } from "../types.ts";
import { getNearestBodyRegion } from "../utils.ts";

const DRAG_THRESHOLD = 6;

export const useBodyMap = (model: Ref<LumpPosition>, readonly: Ref<boolean>) => {
    const { selectedLump, selectedPet } = usePets();
    const { t, locale } = useI18n();

    const pan = reactive({ x: 0, y: 0 });
    const isDragging = ref(false);
    const currentZoom = ref<number>(1);

    const containerRef = ref<HTMLDivElement | null>(null);
    const svgRef = ref<SVGSVGElement | null>(null);
    const pin = ref<SVGCircleElement | null>(null);
    const locationText = ref<string>(t("health.lumpForm.bodyRegions.instructions"));

    let lastNearest: BodyRegion | null = null;
    let dragStart = { x: 0, y: 0 };
    let panStart = { x: 0, y: 0 };
    let dragDistance = 0;
    let pointerId: number | null = null;

    const viewBoxBySpecies = {
        minX: 0,
        minY: 150,
        w: 1024,
        h: 700,
    } as const;

    const wrapperStyle = computed(() => {
        const flipX = model.value.side === "right" ? -1 : 1;
        return {
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${currentZoom.value}) scaleX(${flipX})`,
        };
    });

    const clampPan = () => {
        if (!containerRef.value || currentZoom.value <= 1) {
            pan.x = 0;
            pan.y = 0;
            return;
        }
        const rect = containerRef.value.getBoundingClientRect();
        const overflowX = (rect.width * (currentZoom.value - 1)) / 2;
        const overflowY = (rect.height * (currentZoom.value - 1)) / 2;
        pan.x = Math.min(overflowX, Math.max(-overflowX, pan.x));
        pan.y = Math.min(overflowY, Math.max(-overflowY, pan.y));
    };

    const selectFromScreenPoint = (clientX: number, clientY: number) => {
        if (readonly.value || !svgRef.value || !selectedPet.value) return;
        const rect = svgRef.value.getBoundingClientRect();
        let xPct = (clientX - rect.left) / rect.width;
        const yPct = (clientY - rect.top) / rect.height;
        if (model.value.side === "right") xPct = 1 - xPct;
        const px = viewBoxBySpecies.minX + xPct * viewBoxBySpecies.w;
        const py = viewBoxBySpecies.minY + yPct * viewBoxBySpecies.h;
        placePin(px, py);
    };

    const onPointerDown = (e: PointerEvent) => {
        if (currentZoom.value <= 1) return;
        isDragging.value = true;
        dragDistance = 0;
        pointerId = e.pointerId;
        dragStart = { x: e.clientX, y: e.clientY };
        panStart = { x: pan.x, y: pan.y };
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
        if (!isDragging.value || e.pointerId !== pointerId) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        dragDistance = Math.hypot(dx, dy);
        pan.x = panStart.x + dx;
        pan.y = panStart.y + dy;
        clampPan();
    };

    const onPointerUp = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return;
        isDragging.value = false;
        pointerId = null;
        if (dragDistance < DRAG_THRESHOLD) {
            selectFromScreenPoint(e.clientX, e.clientY);
        }
    };

    const zoom = (factor: number) => {
        currentZoom.value = Math.min(2.5, Math.max(1, currentZoom.value * factor));
    };

    const placePin = (x: number, y: number) => {
        if (!pin.value || !selectedPet.value) return;
        pin.value.setAttribute("cx", String(x));
        pin.value.setAttribute("cy", String(y));
        pin.value.setAttribute("r", "14");
        lastNearest = getNearestBodyRegion(selectedPet.value.species as "dog" | "cat", x, y);
        model.value.x = x;
        model.value.y = y;
        updateReadout();
    };

    const select = (e: MouseEvent) => {
        if (currentZoom.value > 1) return;
        selectFromScreenPoint(e.clientX, e.clientY);
    };

    const updateReadout = () => {
        if (!lastNearest) {
            locationText.value = t("health.lumpForm.bodyRegions.instructions");
            return;
        }
        locationText.value = `📍 ${t(`health.lumpForm.bodyRegions.${lastNearest.id}.${model.value.side}`)}`;
    };

    const getReadoutStyle = () => {
        return {
            "text-sm my-0.5 text-accent": true,
            "text-text-secondary": locationText.value === t("health.lumpForm.bodyRegions.instructions")
        }
    };

    watch(() => currentZoom.value, () => {
        if (currentZoom.value <= 1.01
        ) {
            pan.x = 0;
            pan.y = 0;
        }
    });

    watch(() => [model.value.side, locale.value, readonly.value], () => {
        updateReadout();
    });

    watch(() => readonly.value, (readonly) => {
        if (readonly && selectedLump.value) {
            model.value.side = selectedLump.value!.location.side;
            placePin(selectedLump.value.location.x, selectedLump.value.location.y);
            currentZoom.value = 1;
            pan.x = 0;
            pan.y = 0;
        };
    });

    return {
        currentZoom,
        containerRef,
        svgRef,
        wrapperStyle,
        pin,
        locationText,
        isDragging,
        zoom,
        placePin,
        select,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        getReadoutStyle,
    }
}