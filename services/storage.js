import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { storage } from "@/config/firebase";


export async function uploadImageToFirebase(file) {
    if (!file) throw new Error("No file provided");

    const storageRef = ref(storage, `images/${file.name}`);

    const snapshot = await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}

export async function listAllImages() {
    const listRef = ref(storage, 'images/');
    const res = await listAll(listRef);

    const items = await Promise.all(
        res.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return { url, path: itemRef.fullPath };
        })
    );

    return items;
}

export async function deleteImage(path) {
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
}