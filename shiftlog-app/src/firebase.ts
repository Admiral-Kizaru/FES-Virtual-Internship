import { getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import type { DemoUser, Incident } from "./types";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Object.values(config).every(Boolean);
const app = firebaseEnabled ? (getApps()[0] ?? initializeApp(config)) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const defaultSiteId = import.meta.env.VITE_FIREBASE_SITE_ID || "site-harbor";
const defaultSiteName = import.meta.env.VITE_FIREBASE_SITE_NAME || "Harbor Point";

async function profileFor(user: User): Promise<DemoUser> {
  if (!db) throw new Error("Firebase is not configured.");
  const profile = await getDoc(doc(db, "users", user.uid));
  const data = profile.data();
  return {
    id: user.uid,
    name: data?.name || user.displayName || user.email?.split("@")[0] || "Guard",
    email: user.email || "",
    siteId: data?.siteId || defaultSiteId,
    siteName: data?.siteName || defaultSiteName,
  };
}

export function observeFirebaseUser(callback: (user: DemoUser | null) => void): () => void {
  if (!auth) return () => undefined;
  return onAuthStateChanged(auth, async (user) => callback(user ? await profileFor(user) : null));
}

export async function firebaseSignIn(email: string, password: string): Promise<DemoUser> {
  if (!auth) throw new Error("Firebase is not configured.");
  const result = await signInWithEmailAndPassword(auth, email, password);
  return profileFor(result.user);
}

export async function firebaseCreateAccount(email: string, password: string, name: string): Promise<DemoUser> {
  if (!auth || !db) throw new Error("Firebase is not configured.");
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  const profile: DemoUser = {
    id: result.user.uid,
    name,
    email,
    siteId: defaultSiteId,
    siteName: defaultSiteName,
  };
  await setDoc(doc(db, "users", result.user.uid), profile);
  return profile;
}

export async function firebaseSignOut(): Promise<void> {
  if (auth) await signOut(auth);
}

export function subscribeToIncidents(siteId: string, callback: (incidents: Incident[]) => void): () => void {
  if (!db) return () => undefined;
  return onSnapshot(query(collection(db, "incidents"), where("siteId", "==", siteId)), (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Incident)));
  });
}

export async function addFirebaseIncident(incident: Incident): Promise<void> {
  if (!db) throw new Error("Firebase is not configured.");
  const { id: _id, ...data } = incident;
  await addDoc(collection(db, "incidents"), data);
}

export async function completeFirebaseHandover(incidentIds: string[]): Promise<void> {
  if (!db) throw new Error("Firebase is not configured.");
  await Promise.all(incidentIds.map((incidentId) => updateDoc(doc(db, "incidents", incidentId), { handedOver: true })));
}
