import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, isMockMode, auth } from '@/lib/firebase';
import { Trip } from '@/types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const MOCK_STORAGE_KEY = 'traveloop_mock_trips';

export async function getTrips(userId: string): Promise<Trip[]> {
  if (isMockMode) {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    const trips = stored ? JSON.parse(stored) : [];
    return trips.filter((t: Trip) => t.ownerId === userId);
  }

  if (!db) return [];
  const path = 'trips';
  try {
    const q = query(collection(db, path), where('ownerId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Trip));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveTrip(trip: Trip): Promise<void> {
  if (isMockMode) {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    let trips = stored ? JSON.parse(stored) : [];
    const existingIndex = trips.findIndex((t: Trip) => t.id === trip.id);
    if (existingIndex > -1) {
      trips[existingIndex] = trip;
    } else {
      trips.push(trip);
    }
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(trips));
    return;
  }

  if (!db) return;
  const { id, ...data } = trip;
  const path = 'trips';
  
  try {
    // If ID is short/mocky, it might be from the wizard, so we'll let Firebase generate a real one
    // or use the existing one if it's long enough (likely a Firebase ID)
    if (id.length < 15) { 
      await addDoc(collection(db, path), { 
        ...data, 
        ownerId: trip.ownerId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(doc(db, path, id), { 
        ...data, 
        ownerId: trip.ownerId,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTrip(tripId: string): Promise<void> {
  if (isMockMode) {
    const trips = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY) || '[]');
    const filtered = trips.filter((t: any) => t.id !== tripId);
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(filtered));
    return;
  }
  
  if (!db) return;
  const path = `trips/${tripId}`;
  try {
    await deleteDoc(doc(db, 'trips', tripId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
