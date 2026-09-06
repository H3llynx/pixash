import { collection, deleteDoc, getDocs, type DocumentReference } from "firebase/firestore";

export const deleteSubcollection = async (
    parentRef: DocumentReference,
    subcollectionName: string
) => {
    const subcollectionRef = collection(parentRef, subcollectionName);
    const snapshot = await getDocs(subcollectionRef);

    if (snapshot.empty) return;

    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
};