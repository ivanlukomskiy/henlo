import type { Translation } from './models.ts';
import { atom } from 'nanostores';
import { groupByAddedDate, shuffleArray } from './utils.ts';

export const $translations = atom<Translation[] | null>(null);

// learning
export const $learningWordIds = atom<string[] | null>(null);
export const $learningWordIdx = atom<number>(0);
export const $inverse = atom<boolean>(false);
export const $autoPronounce = atom<boolean>(true);
export const $revealed = atom<boolean>(false);

export function setupLearningRandomOrder() {
  let ids = $translations.get()?.map(t => t.uuid) || [];
  ids = shuffleArray(ids);
  $learningWordIds.set(ids);
  $learningWordIdx.set(0);
}

export function setupLearningByDays() {
  const byDates = groupByAddedDate($translations?.get() ?? []);
  let ids: string[] = [];
  for (const date of Object.keys(byDates).sort()) {
    const words = byDates[date];
    const dayIds = words.map(w => w.uuid);
    ids = ids.concat(shuffleArray(dayIds));
  }
  $learningWordIds.set(ids);
  $learningWordIdx.set(0);
}

export function setupLearningStarredOnly() {
  const starred = ($translations.get() || []).filter(t => t.starred);
  let ids = starred.map(t => t.uuid);
  ids = shuffleArray(ids);
  $learningWordIds.set(ids);
  $learningWordIdx.set(0);
}