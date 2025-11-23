import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCndD8YK-4dbUtZQbv4XVrosnsUdXHqCYw",
  authDomain: "henlo-vocab-app.firebaseapp.com",
  projectId: "henlo-vocab-app",
  storageBucket: "henlo-vocab-app.firebasestorage.app",
  messagingSenderId: "440327640792",
  appId: "1:440327640792:web:2b1a596e394e5609a029ad"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
