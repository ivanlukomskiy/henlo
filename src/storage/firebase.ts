import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import type { Translation } from './models';
import { db } from '../../firebase.ts';

function wordsCollectionRef(user: any) {
  return collection(db, 'users', user.uid, 'words');
}

function wordDocRef(user: any, uuid: string) {
  return doc(db, 'users', user.uid, 'words', uuid);
}

export async function fetchRemoteWords(user: any): Promise<Translation[]> {
  const snap = await getDocs(wordsCollectionRef(user));
  const result: Translation[] = [];
  snap.forEach(d => {
    const data = d.data() as Translation;
    result.push({ ...data, uuid: d.id });
  });
  return result;
}

export async function saveRemoteWord(user: any, word: Translation): Promise<void> {
  const ref = wordDocRef(user, word.uuid);
  await setDoc(ref, word, { merge: true });
}
