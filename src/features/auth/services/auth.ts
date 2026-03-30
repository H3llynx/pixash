import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile
} from "firebase/auth"
import { auth } from '../../../firebase'

type Auth = {
    name?: string
    email: string
    password: string
}

export const handleEmailRegister = async ({ name, email, password }: Auth) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    if (name) await updateProfile(userCredential.user, { displayName: name })
    return userCredential.user
}

export const handleEmailLogin = async ({ email, password }: Auth) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
}

export const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    return userCredential.user
}