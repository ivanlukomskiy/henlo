import type { User } from 'firebase/auth';
import type { Translation } from './models';
import { $translations } from './nanostores';
import { listWords, putWord, updateWord } from './storage.ts';
import { fetchRemoteWords, saveRemoteWord } from './firebase.ts';

export async function syncWords(user: User): Promise<void> {
  const [local, remote] = await Promise.all([listWords(), fetchRemoteWords(user)]);

  const localMap = new Map<string, Translation>();
  const remoteMap = new Map<string, Translation>();

  for (const w of local) localMap.set(w.uuid, w);
  for (const w of remote) remoteMap.set(w.uuid, w);

  const allIds = new Set<string>([...localMap.keys(), ...remoteMap.keys()]);

  const finalLocal: Translation[] = [];

  for (const id of allIds) {
    const l = localMap.get(id) || null;
    const r = remoteMap.get(id) || null;

    if (l && !r) {
      await saveRemoteWord(user, l);
      finalLocal.push(l);
      continue;
    }

    if (!l && r) {
      await putWord(r);
      finalLocal.push(r);
      continue;
    }

    if (l && r) {
      let winner: Translation;

      if (l.updated > r.updated) {
        winner = l;
        await saveRemoteWord(user, winner);
        await updateWord(winner);
      } else if (r.updated > l.updated) {
        winner = r;
        await updateWord(winner);
        await saveRemoteWord(user, winner);
      } else {
        winner = l;
      }

      finalLocal.push(winner);
    }
  }

  $translations.set(finalLocal);
}
