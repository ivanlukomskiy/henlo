import {Component, OnInit} from '@angular/core';
import {StorageService} from '../storage.service';
import {UtilsService} from '../utils/utils.service';
import {ModalController} from '@ionic/angular';
import { Platform } from '@ionic/angular';
import {TextToSpeech} from '@ionic-native/text-to-speech/ngx';

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
    progressBarWidth = '0';

    colouredBackground = true;
    backgroundColor = null;
    showPlay: boolean = false;

    constructor(
        private storage: StorageService,
        private utils: UtilsService,
        public modalController: ModalController,
        private textToSpeech: TextToSpeech,
        private platform: Platform,
    ) {
        console.log('PLATFORM IS', platform.url())
        this.showPlay = platform.is('cordova');
    }

    segmentChanged(event) {
        console.log('event', event.detail.value);
    }

    reverseOrder() {
        this.learnDirection = this.learnDirection == 'ru_en' ? 'en_ru' : 'ru_en'
    }

    switchColouredBackground() {
        this.colouredBackground = !this.colouredBackground;
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
            this.progressBarWidth = this.translations.length > 1 ? (this.currentIndex / (this.translations.length - 1)) * 100 + '%' : '0';
        }
    }

    hashCode(s){
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    }

    rand(min, max) {
        return min + Math.random() * (max - min);
    }

    getColor(translation) {
        if (!this.colouredBackground) {
            return undefined;
        }
        const h = this.hashCode(translation.original + translation.translation) % 360;
        const s = 70 + this.hashCode(translation.original + translation.translation + '1') % 25;
        const l = 92 + this.hashCode(translation.original + translation.translation + '2') % 8;
        return 'hsl(' + h + ',' + s + '%,' + l + '%)';
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
        const translationsFiltered = translations
            .filter(translation => !translation.deleted)
            .filter(translation => translation.original !== '' && translation.translation !== '');
        this.translationsByDays = this.utils.organize(translationsFiltered).translationsByDates;
        this.translationsTotal = [...translationsFiltered];
        this.starredNumber = translationsFiltered.filter(tr => tr.hasOwnProperty('starred') && tr.starred).length;
    }

    private prepareLearning(shuffle = true) {
        if (shuffle) {
            this.utils.shuffleArray(this.translations);
        }
        this.currentIndex = 0;
        this.translation = this.translations[this.currentIndex];
        this.started = true;
        this.unveiled = false;
        this.progressBarWidth = '0';
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

    learnDayByDay() {
        const translations = [];
        for (let dateKey of Object.keys(this.translationsByDays)) {
            const dayTranslations = [...this.translationsByDays[dateKey].translations];
            this.utils.shuffleArray(dayTranslations);
            translations.push.apply(translations, dayTranslations);
        }
        this.translations = translations;
        this.prepareLearning(false);
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

    play(event: any, original: string) {
        event.stopPropagation();
        this.textToSpeech.speak(original)
            .catch((reason: any) => console.log(reason));
    }
}
