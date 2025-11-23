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

export const $user = atom<any>(null);
export const $loading = atom<boolean>(true);
export const $authError = atom<string | null>(null);

export const $colorScheme = atom<'light' | 'dark'>('dark');

export function getNoDrafts(): Translation[] {
  return ($translations.get() || []).filter(t => !t.deleted && t.original && t.translation);
}

export function setupLearningRandomOrder() {
  let ids = getNoDrafts().map(t => t.uuid);
  ids = shuffleArray(ids);
  $learningWordIds.set(ids);
  $learningWordIdx.set(0);
  $revealed.set(false);
}

export function setupLearningByDays() {
  const byDates = groupByAddedDate(getNoDrafts());
  let ids: string[] = [];
  for (const date of Object.keys(byDates).sort((a, b) => b.localeCompare(a))) {
    const words = byDates[date];
    const dayIds = words.map(w => w.uuid);
    ids = ids.concat(shuffleArray(dayIds));
  }
  $learningWordIds.set(ids);
  $learningWordIdx.set(0);
  $revealed.set(false);
}

export function setupLearningStarredOnly() {
  const starred = getNoDrafts().filter(t => t.starred);
  let ids = starred.map(t => t.uuid);
  ids = shuffleArray(ids);
  $learningWordIds.set(ids);
  $learningWordIdx.set(0);
  $revealed.set(false);
}

export interface MonthStats {
  month: string;
  year: number;
  words: number;
}

export function getMonthlyStats(translations: Translation[]): MonthStats[] {
  translations = translations.filter(t => !t.deleted && t.original && t.translation);
  const counts: Record<string, number> = {};

  for (const t of translations) {
    const date = new Date(t.added);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    const key = `${year}-${month}`;
    counts[key] = (counts[key] || 0) + 1;
  }

  const stats: MonthStats[] = [];
  const now = new Date();
  let endDate: Date;

  if (translations.length > 0) {
    const oldestTimestamp = Math.min(...translations.map(t => new Date(t.added).getTime()));
    endDate = new Date(oldestTimestamp);
  } else {
    endDate = now;
  }

  const currentDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const oldestDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (currentDate >= oldestDate) {
    const year = currentDate.getFullYear();
    const monthIndex = currentDate.getMonth();
    const key = `${year}-${monthIndex}`;

    stats.push({
      month: currentDate.toLocaleString('default', { month: 'short' }),
      year: year,
      words: counts[key] || 0,
    });
    currentDate.setMonth(currentDate.getMonth() - 1);
  }

  return stats;
}