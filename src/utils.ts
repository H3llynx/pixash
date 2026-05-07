import { Timestamp } from "firebase/firestore";

export const resetState = (state: any) => {
    Object.keys(state).forEach((key) => {
        (state as Record<string, boolean>)[key] = false;
    });
};

export const shallowEqual = (a: any, b: any) =>
    Object.keys(a).every((key) => {
        if (Array.isArray(a[key]) && Array.isArray(b[key])) {
            return a[key].length === b[key].length &&
                a[key].every((v: any, i: number) => v === b[key][i]);
        }
        return a[key] === b[key];
    });

type DateFormatMode = "date" | "timeUntil" | "input" | "datetime" | "upcoming" | "thatMonth" | "isThisWeek" | "isPast";
type TFunction = (key: string, params?: Record<string, unknown>) => string;

export const getTodayDayKey = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
};

export const tsToDayKey = (ts: Timestamp) => {
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

export const tsToDate = (ts: Timestamp | undefined, mode: DateFormatMode, t?: TFunction, month?: Date) => {
    if (!ts) return;
    const date = ts.toDate();
    const { today, diffDays, diffMonths, eventDay } = getCleanDates(date);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    switch (mode) {
        case "date":
            return date.toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
        case "input":
            return `${y}-${m}-${d}`;
        case "datetime":
            const h = String(date.getHours()).padStart(2, "0");
            const min = String(date.getMinutes()).padStart(2, "0");
            return `${y}-${m}-${d}T${h}:${min}`;
        case "timeUntil": {
            if (!t) return;
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
            return eventDay >= today && eventDay <= end;
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
    const date = new Date(value);
    return Timestamp.fromDate(date);
};

export const dateFromInput = (value: string) => {
    if (!value) return;
    return new Date(value).toLocaleDateString();
}

export const getOneYearLaterInput = (firstDate: string) => {
    if (!firstDate) return;
    const date = new Date(firstDate);
    date.setFullYear(date.getFullYear() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};