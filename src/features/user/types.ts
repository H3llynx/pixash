import type { User } from "firebase/auth";

export type ProfileData = "displayName" | "photoURL";
export type CustomUser = User & {
    photo: string | null;
    firstName: string;
};