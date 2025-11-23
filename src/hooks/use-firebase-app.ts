import { useCallback, useEffect, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase.ts';

type DbResult =
  | { status: 'idle' }
  | { status: 'writing' }
  | { status: 'reading' }
  | { status: 'success'; data: unknown }
  | { status: 'error'; error: string };

const provider = new GoogleAuthProvider()

export function useFirebaseAuth() {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [dbResult, setDbResult] = useState<DbResult>({ status: 'idle' })

  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      u => {
        setUser(u)
        setLoading(false)
      },
      err => {
        setAuthError(err.message)
        setLoading(false)
      }
    )
    return () => unsub()
  }, [])

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null)
    try {
      await signInWithPopup(auth, provider)
    } catch (e) {
      const err = e as Error
      setAuthError(err.message)
    }
  }, [])

  const logout = useCallback(async () => {
    setAuthError(null)
    setDbResult({ status: 'idle' })
    try {
      await signOut(auth)
    } catch (e) {
      const err = e as Error
      setAuthError(err.message)
    }
  }, [])

  const writeTestDoc = useCallback(async () => {
    if (!user) {
      setDbResult({ status: 'error', error: 'Not authenticated' })
      return
    }
    setDbResult({ status: 'writing' })
    try {
      const ref = doc(db, 'users', user.uid, 'debug', 'test')
      await setDoc(ref, {
        updatedAt: new Date().toISOString(),
        sample: 'hello from client',
      })
      setDbResult({ status: 'success', data: { action: 'write', ok: true } })
    } catch (e) {
      const err = e as Error
      setDbResult({ status: 'error', error: err.message })
    }
  }, [user])

  const readTestDoc = useCallback(async () => {
    if (!user) {
      setDbResult({ status: 'error', error: 'Not authenticated' })
      return
    }
    setDbResult({ status: 'reading' })
    try {
      const ref = doc(db, 'users', user.uid, 'debug', 'test')
      const snap = await getDoc(ref)
      if (!snap.exists()) {
        setDbResult({ status: 'error', error: 'Document does not exist' })
        return
      }
      setDbResult({ status: 'success', data: snap.data() })
    } catch (e) {
      const err = e as Error
      setDbResult({ status: 'error', error: err.message })
    }
  }, [user])

  return {
    user,
    loading,
    authError,
    dbResult,
    signInWithGoogle,
    logout,
    writeTestDoc,
    readTestDoc,
  }
}
