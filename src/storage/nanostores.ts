import type { Translation } from './models.ts';
import { atom } from 'nanostores';

export const $translations = atom<Translation[] | null>(null)
