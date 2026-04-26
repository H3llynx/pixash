import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile
} from "firebase/auth"
import { auth } from '../config/firebase'
import type { ProfileData } from "../features/user/types"

type Auth = {
    name?: string
    email: string
    password: string
}

export const handleEmailRegister = async ({ name, email, password }: Auth) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential.user;
}

export const handleEmailLogin = async ({ email, password }: Auth) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

export const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
}

export async function updateUserProfile(item: ProfileData, data: string) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("No authenticated user");
    }
    await updateProfile(user, { [item]: data });
}