import equal from 'fast-deep-equal';
import { Timestamp } from "firebase/firestore";
import { i18n } from "./features/language/config/i18n";

export const resetState = (state: Record<string, boolean>) => {
    Object.keys(state).forEach((key) => {
        state[key] = false;
    });
};

export const shallowEqual = (formData: any, source: any) => {
    return Object.keys(formData).every((key) =>
        equal(formData[key], source[key])
    );
};

export const resetForm = <T extends object>(
    formData: T,
    defaultForm: T
) => {
    const entries = Object.entries(defaultForm) as [keyof T, T[keyof T]][];
    for (const [key, value] of entries) {
        formData[key] = structuredClone(value);
    }
};

type DateFormatMode = "date" | "timeUntil" | "input" | "datetime" | "upcoming" | "thatMonth" | "isThisWeek" | "isPast";

export const tsToDay = (ts: Timestamp) => {
    const d = ts.toDate();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
};

const getCleanDates = (date: Date) => {
    const eventDay = new Date(date);
    eventDay.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffMs = eventDay.getTime() - today.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = (eventDay.getFullYear() - today.getFullYear()) * 12 + (eventDay.getMonth() - today.getMonth());
    return { eventDay, today, diffDays, diffMonths }
}

export const tsToDate = (ts: Timestamp | undefined, mode: DateFormatMode, month?: Date) => {
    if (!ts) return;
    const date = ts.toDate();
    const locale = i18n.global.locale.value;
    const t = i18n.global.t;
    const { today, diffDays, diffMonths, eventDay } = getCleanDates(date);

    switch (mode) {
        case "date":
            return date.toLocaleDateString(locale, {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
        case "input":
            return [date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
            ].join("-");
        case "datetime":
            return [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, "0"),
                String(date.getDate()).padStart(2, "0")
            ].join("-") + "T" + [
                String(date.getHours()).padStart(2, "0"),
                String(date.getMinutes()).padStart(2, "0")
            ].join(":");
        case "timeUntil": {
            if (diffDays === -1) return t("tsToDate.yesterday");
            if (diffDays === 0) return t("tsToDate.today");
            if (diffDays === 1) return t("tsToDate.tomorrow");
            if (diffDays > 1) return diffDays > 30 ? t("tsToDate.monthsUntil", { number: diffMonths }) : t("tsToDate.daysUntil", { number: diffDays });
            if (diffDays < -30) return t("tsToDate.monthsAgo", { number: Math.abs(diffMonths) });
            return t("tsToDate.daysAgo", { number: Math.abs(diffDays) });
        }
        case "upcoming": {
            const end = new Date(today);
            end.setMonth(end.getMonth() + 3);
            end.setHours(23, 59, 59, 999);
            return eventDay <= end;
        }
        case "thatMonth": {
            if (!month) return;
            return date.getMonth() === month.getMonth() &&
                date.getFullYear() === month.getFullYear();
        }
        case "isThisWeek": {
            return diffDays >= 0 && diffDays < 7;
        }
        case "isPast": {
            return diffDays < 0;
        }
    }
};

export const tsFromInput = (value: string) => {
    if (!value) return;
    const [datePart, timePart] = value.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = (timePart ?? "00:00").split(":").map(Number);
    const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
    return Timestamp.fromDate(date);
};

export const getOneYearLaterInput = (firstDate: string) => {
    if (!firstDate) return;
    const date = new Date(firstDate);
    date.setFullYear(date.getFullYear() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const todayAsInput = () => {
    const now = new Date();
    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");
};

export const formatDateTimeLocal = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatDateRange = (start: Date, end: Date) => {
    const locale = i18n.global.locale.value;
    const formatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });
    return formatter.formatRange(start, end);
};

export const getLabel = (item: string, array: { id: string, label: string }[]) => {
    return array.find(t => t.id === item)?.label ?? "";
};

export const getChartColor = (variable: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();