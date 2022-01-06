import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Subject} from 'rxjs';
import {v4 as uuid} from 'uuid';
import {HttpClient} from '@angular/common/http';
import {Error} from 'tslint/lib/error';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    translations = null;
    subject = new Subject();

    constructor(private storage: Storage,
                private http: HttpClient) {
    }

    async sync() {
        if (this.translations === null || this.translations === undefined) {
            return;
        }
        const location = await this.getProperty('backendAddress');
        console.log('location: ', location);
        return this.http.post(location + '/api/v1/sync',
            this.translations
        ).toPromise().then(data => {
            this.translations = data;
        }).then(() => {
            return this.saveAll(this.translations);
        }).then(() => {
            this.subject.next(this.translations);
        });
    }

    getSettings() {
        return this.storage.get('settings');
    }

    setSettings(settings) {
        return this.storage.set('settings', settings);
    }

    async getProperty(key) {
        let settings = await this.getSettings();
        if (!settings) {
            settings = {};
        }
        if (!settings.hasOwnProperty(key)) {
            return '';
        } else {
            return settings[key];
        }
    }

    async setProperty(key, value) {
        let settings = await this.storage.get('settings');
        if (!settings) {
            settings = {};
        }
        settings[key] = value;
        await this.setSettings(settings);
    }

    subscribe(callback) {
        const self = this;
        self.subject.subscribe(callback);
        this.load();
    }

    getSnapshot() {
        return this.load()
            .then(translations => JSON.parse(JSON.stringify(translations)));
    }

    starTranslation(translationUuid, starred) {
        const self = this;
        const index = this.translations.findIndex(tr => tr.uuid === translationUuid);
        if (index === -1) {
            throw new Error('Translation with uuid ' + translationUuid + ' not found');
        }
        const translation = self.translations[index];
        translation.updated = new Date().getTime();
        translation.starred = starred;
        return this.storage.set('translations', this.translations)
            .then(() => {
                this.subject.next(self.translations);
            });
    }

    load() {
        console.log('loading translations');
        const _self = this;
        if (_self.translations !== null) {
            _self.subject.next(_self.translations);
            return Promise.resolve(_self.translations);
        }
        return _self.storage.get('translations')
            .then(translations => {
                if (!translations) {
                    return [];
                }
                console.log('translations: ', translations);
                translations.forEach(translation => {
                    if (typeof translation.added === 'string') {
                        translation.added = new Date(translation.added).getTime();
                    }
                    if (translation.added instanceof Date) {
                        translation.added = translation.added.getTime();
                    }
                    if (translation.hasOwnProperty('updated')) {
                        delete translation.updated;
                    }
                });
                return translations;
            })
            .then(val => {
                _self.translations = val;
                _self.subject.next(val);
                return val;
            });
    }

    clear() {
        console.log('clearing service');
        const newTranslations = [];
        this.translations = newTranslations;
        return this.storage.set('translations', newTranslations)
            .then(() => {
                this.subject.next(newTranslations);
            });
    }

    generate() {
        console.log('generating transaction examples');
        const newTranslations = [];
        for (let i = 0; i < 500; i++) {
            const timestamp = new Date().getTime() - Math.random() * 24 * 60 * 60 * 1000 * 50;
            const newTranslation = {
                original: Math.random().toString(36).substring(7),
                translation: Math.random().toString(36).substring(7),
                added: timestamp,
                uuid: uuid()
            };
            newTranslations.push(newTranslation);
        }
        this.translations = newTranslations;
        return this.storage.set('translations', newTranslations)
            .then(() => {
                this.subject.next(this.translations);
            });
    }

    update(translation, updateCreationTime) {
        console.log('updating record', translation);
        const self = this;
        const index = this.translations.findIndex(tr => tr.uuid === translation.uuid);
        if (index === -1) {
            throw new Error('Translation with uuid ' + translation.uuid + ' not found');
        }
        if (updateCreationTime) {
            translation.added = new Date().getTime();
        }
        translation.updated = new Date().getTime();
        self.translations[index] = translation;
        return this.storage.set('translations', this.translations)
            .then(() => {
                this.subject.next(self.translations);
            });
    }

    save(original, translation, starred) {
        console.log('saving new translations');
        const newTranslation = {
            original,
            translation,
            starred,
            added: new Date().getTime(),
            uuid: uuid()
        };
        const newTranslations = this.translations === null ? [newTranslation] : [newTranslation, ...this.translations];
        this.translations = newTranslations;
        return this.storage.set('translations', newTranslations)
            .then(() => {
                this.subject.next(this.translations);
            });
    }

    saveAll(newTranslations) {
        return this.storage.set('translations', newTranslations);
    }

    remove(uuidToDelete) {
        console.log('removing translation');
        const _self = this;
        _self.translations.filter(translation => translation.uuid === uuidToDelete)
            .forEach(translation => {
                translation.deleted = true;
                translation.updated = new Date().getTime();
            });
        _self.storage.set('translations', _self.translations)
            .then(() => {
                _self.subject.next(this.translations);
            });
    }
}
