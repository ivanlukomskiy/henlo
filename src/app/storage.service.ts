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

    subscribe(callback) {
        this.load();
        this.subject.subscribe(callback);
    }

    getSnapshot() {
        console.log('getting snap');
        return this.load()
            .then(translations => JSON.parse(JSON.stringify(translations)));
    }

    load() {
        const _self = this;
        if (_self.translations !== null) {
            _self.subject.next(_self.translations);
            return Promise.resolve(_self.translations);
        }
        return _self.storage.get('translations')
            .then(val => {
                _self.translations = val;
                _self.subject.next(val);
                return val;
            });
    }

    save(original, translation) {
        const newTranslation = {
            original,
            translation,
            added: new Date(),
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
        const _self = this;
        _self.translations = _self.translations.filter(translation => translation.uuid !== uuidToDelete);
        _self.storage.set('translations', _self.translations)
            .then(() => {
                _self.subject.next(this.translations);
            });
    }
}
