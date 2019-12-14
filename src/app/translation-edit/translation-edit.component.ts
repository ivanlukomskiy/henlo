import {AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {StorageService} from '../storage.service';
import * as Hammer from './../../../node_modules/hammerjs/hammer.js';
import {ModalController, NavController} from '@ionic/angular';

const PAN_MIN_SHIFT = 40;

@Component({
    selector: 'app-translation-edit',
    templateUrl: './translation-edit.component.html',
    styleUrls: ['./translation-edit.component.scss'],
})
export class TranslationEditComponent implements OnInit {

    @Input() edit = false;
    @Input() translation = {
        original: '',
        translation: ''
    };
    translationsNumber = 0;

    tick = 0;
    shift = '50px';
    hintText = '';
    hintColor = '#000';
    @ViewChild('inputOriginal', {static: true}) originalInput!: ElementRef;

    constructor(
        private ngZone: NgZone,
        private storage: StorageService,
        public modalController: ModalController
    ) {
    }

    save() {
        const self = this;
        if (this.translation.original === '' || this.translation.translation === '') {
            console.log('Couldn\'t save, some fields are empty');
            return;
        }
        if (self.edit) {
            console.log('this.translation: ', this.translation);
            self.storage.update(this.translation)
                .then(() => {
                    self.cancel();
                });
        } else {
            self.storage.save(self.translation.original, self.translation.translation)
                .then(() => {
                    self.cancel();
                });
        }
    }

    cancel() {
        const self = this;
        self.translation = {original: '', translation: ''};
        if (self.edit) {
            self.modalController.dismiss({dismissed: true});
        } else {
            self.focus();
        }
    }

    focus() {
        const self = this;
        // setTimeout(() => {
        //     self.originalInput.setFocus();
        // }, 100);
    }

    setText(text, transparency, self) {
        self.hintText = text;
        self.hintColor = 'rgba(128, 128, 128, ' + transparency + ')';
    }

    ngOnInit(): void {
        this.focus();
        const _self = this;
        this.storage.subscribe(translations => {
            _self.translationsNumber = translations.length;
        });
        console.log('this.translation: ', this.translation);
    }
}
