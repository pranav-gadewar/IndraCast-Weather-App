import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export interface SystemSettings {
  maintenanceMode: boolean;
  userRegistration: boolean;
  tempUnit: "C" | "F";
  refreshRate: string;
  updatedAt?: unknown;
}

const DEFAULT_SETTINGS: SystemSettings = {
  maintenanceMode: false,
  userRegistration: true,
  tempUnit: "C",
  refreshRate: "15m",
};

export async function getSystemSettings(): Promise<SystemSettings> {
  try {
    const docRef = doc(db, "settings", "system");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...DEFAULT_SETTINGS, ...docSnap.data() };
    } else {
      // Initialize default settings doc if not found
      await setDoc(docRef, { ...DEFAULT_SETTINGS, updatedAt: serverTimestamp() });
      return DEFAULT_SETTINGS;
    }
  } catch (err) {
    console.warn("Could not fetch system settings from Firestore, returning defaults:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSystemSettings(data: Partial<SystemSettings>): Promise<void> {
  const docRef = doc(db, "settings", "system");
  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
