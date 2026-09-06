import {
    createUserWithEmailAndPassword,
    deleteUser,
    EmailAuthProvider,
    GoogleAuthProvider,
    reauthenticateWithCredential,
    reauthenticateWithPopup,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile
} from "firebase/auth"
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore"
import { DB } from "../config/config"
import { auth, db } from '../config/firebase'
import type { ProfileData } from "../features/user/types"
import { deleteSubcollection } from "./helpers"
import { deletePet } from "./pets"

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
    provider.setCustomParameters({ prompt: 'select_account' });
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

export const reauthenticate = async (password?: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    const providerId = user.providerData[0]?.providerId;
    if (providerId === 'password') {
        if (!password) throw new Error('Password required for re-authentication');
        const credential = EmailAuthProvider.credential(user.email!, password);
        await reauthenticateWithCredential(user, credential);
    } else if (providerId === 'google.com') {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
    } else {
        throw new Error(`Unsupported provider: ${providerId}`);
    }
}

export const deleteAccount = async (userId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    try {
        const userRef = doc(db, DB.users, userId);
        const petsSnapshot = await getDocs(collection(userRef, DB.pets));
        await Promise.all(
            petsSnapshot.docs.map(petDoc => deletePet(petDoc.id, userId))
        );
        await deleteSubcollection(userRef, DB.vets);
        await deleteDoc(userRef);
        await deleteUser(user);

    } catch (error) {
        console.error("Error deleting account: ", error);
        throw error;
    }
}