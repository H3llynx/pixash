import { Timestamp } from "firebase/firestore";
import type { DateFormatMode } from "./types";

export const resetState = (state: any) => {
    Object.keys(state).forEach((key) => {
        (state as Record<string, boolean>)[key] = false;
    });
};

export const shallowEqual = (a: any, b: any) =>
    Object.keys(a).every((key) => a[key] === b[key]);

export const tsToDate = (ts: Timestamp, mode: DateFormatMode) => {
    if (!ts) return;
    const date = ts.toDate();
    switch (mode) {
        case "date":
            return date.toLocaleDateString();
        case "datetime":
            return date.toLocaleString();
        case "daysUntil": {
            const now = new Date();
            const diffMs = date.getTime() - now.getTime();
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 && "s"} ago`;
            if (diffDays === 0) return "today";
            if (diffDays === 1) return "tomorrow";
            return `in ${diffDays} days`;
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