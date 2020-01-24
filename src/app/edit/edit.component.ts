import {Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../storage.service';
import {ModalController} from '@ionic/angular';
import {UtilsService} from '../utils/utils.service';

@Component({
    selector: 'app-translation-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {

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
    @ViewChild('inputOriginal', {static: true}) originalInput!: any;
    @ViewChild('translationInput', {static: true}) translationInput!: any;

    constructor(
        private ngZone: NgZone,
        private storage: StorageService,
        private utils: UtilsService,
        public modalController: ModalController
    ) {
    }

    save() {
        const self = this;
        if (self.edit) {
            console.log('this.translation: ', this.translation);
            self.storage.update(this.translation)
                .then(() => {
                    self.cancel();
                });
        } else {
            self.storage.save(self.translation.original, self.translation.translation)
                .then(() => {
                    self.translation = {original: '', translation: ''};
                });
        }
    }

    cancel() {
        const self = this;
        self.modalController.dismiss({dismissed: true});
    }

    focus() {
        const self = this;
        setTimeout(() => {
            self.originalInput.setFocus();
        }, 100);
    }

    setText(text, transparency, self) {
        self.hintText = text;
        self.hintColor = 'rgba(128, 128, 128, ' + transparency + ')';
    }

    ngOnInit(): void {
        const self = this;
        this.storage.subscribe(translations => {
            self.translationsNumber = self.utils.countTodayTranslations(translations);
        });
        if (!this.edit) {
            this.focus();
        }
    }

    deleteItem() {
        this.modalController.dismiss({deleted: true});
    }

    sweptRight() {
        const self = this;
        if (this.translation.original === '' || this.translation.original == null) {
            setTimeout(() => {
                self.originalInput.setFocus();
            }, 50);
        } else if (this.translation.translation === '' || this.translation.translation == null) {
            setTimeout(() => {
                self.translationInput.setFocus();
            }, 50);
        } else {
            this.save();
        }
    }
}
