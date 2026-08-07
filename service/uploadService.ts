import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebaseConfig";

// Takes a local file URI (from the camera or photo library) and uploads it
// to Firebase Storage, returning a public download URL to store on the car.
export async function uploadCarPhoto(localUri: string): Promise<string> {
  const response = await fetch(localUri);
  const blob = await response.blob();

  const filename = `cars/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const storageRef = ref(storage, filename);

  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}
