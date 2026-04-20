import { FirebaseError } from 'firebase/app';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { computed, ref } from 'vue';
import { auth } from "../../../config/firebase";
import { handleEmailLogin, handleEmailRegister, handleGoogleLogin } from "../../../services/auth";

const firebaseUser = ref<User | null>(null);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const user = computed(() => {
    if (!firebaseUser.value) return null;
    return {
        ...firebaseUser.value,
        firstName: firebaseUser.value.displayName?.split(" ")[0] ?? "",
        photo: firebaseUser.value.photoURL,
    }
})

const authReady = new Promise<void>((resolve) => {
    onAuthStateChanged(auth, (fbUser) => {
        firebaseUser.value = fbUser;
        loading.value = false;
        resolve();
    });
});

const handleAuthAction = async (action: () => Promise<User>) => {
    try {
        error.value = null;
        await action();
    } catch (e) {
        if (e instanceof FirebaseError) {
            error.value = e.message;
        } else {
            error.value = "An unexpected error occurred";
        }
    }
}

export const useAuth = () => {
    const loginWithEmail = async (email: string, password: string) => {
        await handleAuthAction(() => handleEmailLogin({ email, password }));
    };

    const registerWithEmail = async (name: string, email: string, password: string) => {
        await handleAuthAction(async () => {
            const user = await handleEmailRegister({ name, email, password });
            firebaseUser.value = { ...user };
            return user;
        });
    };

    const loginWithGoogle = async () => {
        await handleAuthAction(() => handleGoogleLogin());
    };

    async function logout() {
        await signOut(auth);
    };

    return { authReady, user, loading, error, loginWithEmail, registerWithEmail, loginWithGoogle, logout }
}