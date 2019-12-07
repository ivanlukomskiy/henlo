import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

    translations = [];

    constructor(private storage: Storage) {
    }

    deleteTranslation(translation) {
        console.log('Delete translation ');
    }

    editTranslation(translation) {
        console.log('knlklkm');
    }

    ngOnInit(): void {
        const _self = this;
        _self.storage.get('translations')
            .then(val => {
                _self.translations = val;
            });
    }
}
