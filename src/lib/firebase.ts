import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

import firebaseConfig from '../../firebase-applet-config.json';

const app = (firebaseConfig as any).apiKey ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId) : null;

export const isMockMode = !app || !(firebaseConfig as any).apiKey;

// Test connection
if (db && !isMockMode) {
  const testConnection = async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  };
  testConnection();
}

