import {Component, OnInit} from '@angular/core';
import {StorageService} from '../storage.service';
import {UtilsService} from '../utils/utils.service';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
    objectKeys = Object.keys;

    translation = null;
    unveiled = false;
    started = false;

    learnDirection = 'en_ru';

    translations;
    currentIndex = 0;
    translationsByDays;

    options = [];

    constructor(
        private storage: StorageService,
        private utils: UtilsService
    ) {
        // storage.getSettings()
    }

    segmentChanged(event) {
        console.log('event', event.detail.value);
    }

    tapped() {
        if (!this.unveiled) {
            this.unveiled = true;
        } else {
            this.currentIndex++;
            if (this.currentIndex >= this.translations.length) {
                this.currentIndex = 0;
                this.utils.shuffleArray(this.translations);
            }
            this.translation = this.translations[this.currentIndex];
            this.unveiled = false;
        }
    }

    back() {
        this.started = false;
    }

    datePretty(date) {
        return this.utils.datePretty(date);
    }

    learn(key) {
        this.translations = this.translationsByDays[key].translations;
        this.utils.shuffleArray(this.translations);
        this.currentIndex = 0;
        this.translation = this.translations[this.currentIndex];
        this.started = true;
    }

    updateList(translations) {
        this.translationsByDays = this.utils.sortAndGroup(translations);
        console.log('this.translationsByDays: ', this.translationsByDays);
        console.log('this.translationsByDays.length: ', Object.keys(this.translationsByDays).length);
    }

    ngOnInit(): void {
        const _self = this;
        this.storage.subscribe(translations => {
            console.log('translations: ', translations);
            _self.updateList(translations);
        });
    }

    ionViewDidEnter() {
    }
}
