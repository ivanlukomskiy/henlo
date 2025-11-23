import { useEffect } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth } from '../../firebase.ts';
import { $authError, $loading, $user } from '../storage/nanostores.ts';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});

function isStandalonePWA() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // iOS Safari PWA
    (window.navigator as any).standalone === true
  );
}

export async function henloSignIn() {
  $authError.set(null);
  try {
    if (isStandalonePWA()) {
      await signInWithRedirect(auth, provider);
      return;
    }
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
