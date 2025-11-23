import type { Translation } from './models.ts';
import { $translations } from './nanostores.ts';

const DB_NAME = 'vocab';
const DB_VERSION = 1;
const STORE = 'words';

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      const store = db.createObjectStore(STORE, { keyPath: 'uuid' });
      store.createIndex('added', 'added');
      store.createIndex('updated', 'updated');
      store.createIndex('deleted', 'deleted');
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putWord(word: Translation): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(word);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);

    $translations.set([...($translations.get() ?? []), word]);
  });
}

export async function updateWord(word: Translation): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(word);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);

    $translations.set(
      $translations.get()?.map(t => {
        if (t.uuid === word.uuid) {
          return word;
        }
        return t;
      }) ?? [],
    );
  });
}

export async function getWord(uuid: string) {
  const db = await openDB();
  return new Promise<Translation>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(uuid);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function listWords(): Promise<Translation[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
