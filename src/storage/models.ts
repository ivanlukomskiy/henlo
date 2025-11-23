export interface Translation {
  uuid: string
  original: string
  translation: string
  starred: boolean
  added: number
  updated: number
  deleted: boolean
}

export interface AppSettings {
  autoPronounce: boolean
  learnInverse: boolean
}
