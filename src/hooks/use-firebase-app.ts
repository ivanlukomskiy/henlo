import { useEffect } from 'react';
import { getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
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
    getRedirectResult(auth).catch(err => {
      $authError.set(err.message);
    });

    const unsubscribe = onAuthStateChanged(
      auth,
      u => {
        console.log('user:', JSON.stringify(u, null, 2));
        $user.set(u);
        $loading.set(false);
      },
      err => {
        $authError.set(err.message);
        $loading.set(false);
      },
    );

    return () => unsubscribe();
  }, []);
}