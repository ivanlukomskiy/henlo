import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../storage.service';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

    translationsFiltered = [];
    translations = [];
    search = '';

    constructor(private storage: StorageService) {
    }

    searchChanged(val) {
        console.log('val', val.detail.value);
        this.updateList(val.detail.value);
    }

    updateList(val) {
        const search = val ? val : this.search;
        const regExp = new RegExp(search, 'i');
        this.translationsFiltered = this.translations.filter(translation =>
            regExp.test(translation.original) || regExp.test(translation.translation));
        this.translations.forEach(translation => {
            console.log(translation, regExp.test(translation.original), regExp.test(translation.translation));
        });
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
}
