import { useEffect } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../../firebase.ts';
import { $authError, $loading, $user } from '../storage/nanostores.ts';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});

export async function henloSignIn() {
  $authError.set(null);
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    const err = e as Error;
    $authError.set(err.message);
  }
}

export async function henloSignOut() {
  $authError.set(null);
  try {
    await signOut(auth);
  } catch (e) {
    const err = e as Error;
    $authError.set(err.message);
  }
}

export function useFirebaseAuth() {
  useEffect(() => {
    onAuthStateChanged(
      auth,
      u => {
        $user.set(u);
        $loading.set(false);
      },
      err => {
        $authError.set(err.message);
        $loading.set(false);
      },
    );
  });
}
