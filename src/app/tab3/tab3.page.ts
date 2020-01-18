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

    learnDirection = 'ru_en';

    translations;
    translationsTotal;
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

    timestampPretty(timestamp) {
        return this.utils.datePretty(new Date(timestamp));
    }

    learn(key) {
        this.translations = this.translationsByDays[key].translations;
        this.prepareLearning();
    }

    updateList(translations) {
        this.translationsByDays = this.utils.sortAndGroup(translations);
        this.translationsTotal = [...translations];
        this.started = false;
    }

    private prepareLearning() {
        this.utils.shuffleArray(this.translations);
        this.currentIndex = 0;
        this.translation = this.translations[this.currentIndex];
        this.started = true;
        this.unveiled = false;
    }

    ngOnInit(): void {
        const _self = this;
        this.storage.subscribe(translations => {
            console.log('translations: ', translations);
            _self.updateList(translations);
        });
    }

    learnAll() {
        console.log('learn all');
        this.translations = this.translationsTotal;
        this.prepareLearning();
    }

    swiped(event) {
        console.log('event: ', event);
    }
}
