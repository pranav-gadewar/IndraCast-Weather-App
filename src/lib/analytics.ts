import { db } from "./firebase";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";

export async function incrementWeatherQueries(): Promise<number> {
  try {
    const docRef = doc(db, "analytics", "queries");
    await setDoc(docRef, { count: increment(1) }, { merge: true });
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data().count || 1 : 1;
  } catch {
    return 0;
  }
}

export async function getWeatherQueriesCount(): Promise<number> {
  try {
    const snap = await getDoc(doc(db, "analytics", "queries"));
    return snap.exists() ? snap.data().count || 0 : 0;
  } catch {
    return 0;
  }
}
