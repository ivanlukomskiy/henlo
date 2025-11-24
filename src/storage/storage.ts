import type { AppSettings, Translation } from './models.ts';
import { $autoPronounce, $inverse, $translations } from './nanostores.ts';

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

export async function saveSettings(): Promise<void> {
  const settings = {
    autoPronounce: $autoPronounce.get(),
    learnInverse: $inverse.get(),
  };
  localStorage.setItem('appSettings', JSON.stringify(settings));
  return Promise.resolve();
}

export function loadSettings(): AppSettings | null {
  const settingsStr = localStorage.getItem('appSettings');
  if (!settingsStr) return null;
  try {
    return JSON.parse(settingsStr) as AppSettings;
  } catch {
    return null;
  }
}

export function saveLearningRoadmap(ids: string[] | null): void {
  const roadmap = {
    ids,
  };
  localStorage.setItem('learningRoadmap', JSON.stringify(roadmap));
}

export function loadLearningRoadmap(): string[] | null {
  const roadmapStr = localStorage.getItem('learningRoadmap');
  if (!roadmapStr) return null;
  try {
    const roadmap = JSON.parse(roadmapStr) as { ids: string[] | null };
    return roadmap.ids;
  } catch {
    return null;
  }
}

export function saveLearningProgress(idx: number, revealed: boolean): void {
  const progress = {idx, revealed};
  localStorage.setItem('learningProgressIdx', JSON.stringify(progress));
}

export function loadLearningProgress(): {idx: number; revealed: boolean} {
  const progressStr = localStorage.getItem('learningProgressIdx');
  if (!progressStr) return {idx: 0, revealed: false};
  try {
    return JSON.parse(progressStr) as { idx: number; revealed: boolean };
  } catch {
    return {idx: 0, revealed: false};
  }
}
