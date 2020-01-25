import {Component, OnInit} from '@angular/core';
import {StorageService} from '../storage.service';
import {UtilsService} from '../utils/utils.service';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-tab3',
    templateUrl: 'learn.page.html',
    styleUrls: ['learn.page.scss']
})
export class LearnPage implements OnInit {
    objectKeys = Object.keys;

    translation = null;
    unveiled = false;
    started = false;

    learnDirection = 'ru_en';

    translations;
    translationsTotal;
    starredNumber = 0;
    currentIndex = 0;
    translationsByDays;

    options = [];

    constructor(
        private storage: StorageService,
        private utils: UtilsService,
        public modalController: ModalController
    ) {
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
        const translationsFiltered = translations.filter(translation => !translation.deleted);
        this.translationsByDays = this.utils.sortAndGroup(translationsFiltered);
        this.translationsTotal = [...translationsFiltered];
        this.starredNumber = translationsFiltered.filter(tr => tr.hasOwnProperty('starred') && tr.starred).length;
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
            _self.updateList(translations);
        });
    }

    learnStarred() {
        this.translations = this.translationsTotal.filter(tr => tr.hasOwnProperty('starred') && tr.starred);
        this.prepareLearning();
    }

    learnAll() {
        this.translations = this.translationsTotal;
        this.prepareLearning();
    }

    swipedLeft() {
        this.modalController.dismiss({dismissed: true});
    }

    sweptVertically(event) {
        if (this.translation.hasOwnProperty('starred') && this.translation.starred) {
            this.translation.starred = false;
            this.storage.starTranslation(this.translation['uuid'], false);
        } else {
            this.translation.starred = true;
            this.storage.starTranslation(this.translation['uuid'], true);
        }
    }
}
