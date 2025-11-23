import { useEffect } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';
import { auth } from '../../firebase.ts';
import { $authError, $loading, $user } from '../storage/nanostores.ts';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});

interface StandaloneNavigator extends Navigator {
  standalone?: boolean;
}

function isStandalonePWA(): boolean {
  const isStandaloneDisplayMode =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(display-mode: standalone)').matches;

  const isIOSStandalone =
    typeof window !== 'undefined' &&
    ((window.navigator as StandaloneNavigator).standalone === true);

  return Boolean(isStandaloneDisplayMode || isIOSStandalone);
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
    // Handle redirect result once after returning from provider
    getRedirectResult(auth)
      .then((result) => {
        const userCredential = result as UserCredential | null;
        if (userCredential?.user) {
          $user.set(userCredential.user);
        }
      })
      .catch(err => {
        $authError.set(err.message);
      })
      .finally(() => {
        $loading.set(false);
      });

    const unsubscribe = onAuthStateChanged(
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

    return () => unsubscribe();
  }, []);
}