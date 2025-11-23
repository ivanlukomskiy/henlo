import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCTyRvP76I_K2C0zU-hT1rkJZKmnCvlYgM",
  authDomain: "henlo-c012d.firebaseapp.com",
  projectId: "henlo-c012d",
  storageBucket: "henlo-c012d.firebasestorage.app",
  messagingSenderId: "725559120284",
  appId: "1:725559120284:web:5788c473cb6afbe5ea7859"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
