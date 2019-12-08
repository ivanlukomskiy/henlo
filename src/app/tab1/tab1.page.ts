import {Component, OnInit} from '@angular/core';
import {StorageService} from '../storage.service';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
    objectKeys = Object.keys;

    translationsFiltered = [];
    translations = [];
    search = '';
    translationsByDates = {};

    constructor(private storage: StorageService) {
    }

    searchChanged(val) {
        console.log('val', val.detail.value);
        this.updateList(val.detail.value);
    }

    truncateHours(date) {
        const truncated = new Date(date);
        truncated.setHours(0, 0, 0, 0);
        return truncated;
    }

    updateList(val) {
        const self = this;
        const search = val ? val : this.search;
        const regExp = new RegExp(search, 'i');
        this.translationsFiltered = this.translations.filter(translation =>
            regExp.test(translation.original) || regExp.test(translation.translation));

        const translationsByDates = {};
        this.translationsFiltered.forEach(a => {
            const date = self.truncateHours(a.added);
            const key = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
            if (!translationsByDates.hasOwnProperty(key)) {
                translationsByDates [key] = {date, translations: []};
            }
            translationsByDates [key].translations.push(a);
        });
        this.translationsByDates = translationsByDates;
        console.log('translationsByDates: ', translationsByDates);
    }

    deleteTranslation(translation) {
        this.storage.remove(translation.uuid);
    }

    editTranslation(translation) {
    }

    ngOnInit(): void {
        const _self = this;
        console.log(this.storage);
        this.storage.subscribe(translations => {
            _self.translations = translations;
            _self.updateList(null);
        });
    }

    datePretty(date: Date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();

        const truncated = this.truncateHours(date).getTime();
        const diff = (truncated - todayTime) / 24 / 60 / 60 / 1000;
        if (diff === 0) {
            return 'Today';
        } else if (diff === 1) {
            return 'Yesterday';
        } else if (diff < 20) {
            return diff + ' days ago';
        } else if (today.getFullYear() === date.getFullYear()) {
            return date.getDay + ' ' + monthNames[date.getMonth()];
        } else {
            return date.getDay + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
        }
    }

}
