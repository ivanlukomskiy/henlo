import {Injectable, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Subject} from 'rxjs';
import {v4 as uuid} from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    translations = null;
    subject = new Subject();

    constructor(private storage: Storage) {
    }

    getSettings() {
        return this.storage.get('settings');
    }

    setSettings(settings) {
        return this.storage.set('settings', settings);
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

    load() {
        console.log('loading translations');
        const _self = this;
        if (_self.translations !== null) {
            _self.subject.next(_self.translations);
            return Promise.resolve(_self.translations);
        }
        return _self.storage.get('translations')
            .then(translations => {
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

    update(translation) {
        console.log('updating record');
        const self = this;
        const index = this.translations.findIndex(tr => tr.uuid === translation.uuid);
        if (index === -1) {
            throw new Error('Translation with uuid ' + translation.uuid + ' not found');
        }
        // translation.updated = new Date().getTime();
        self.translations[index] = translation;
        return this.storage.set('translations', this.translations)
            .then(() => {
                this.subject.next(self.translations);
            });
    }

    save(original, translation) {
        console.log('saving new translations');
        const newTranslation = {
            original,
            translation,
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

    remove(uuidToDelete) {
        console.log('removing translation');
        const _self = this;
        _self.translations = _self.translations.filter(translation => translation.uuid !== uuidToDelete);
        _self.storage.set('translations', _self.translations)
            .then(() => {
                _self.subject.next(this.translations);
            });
    }
}
