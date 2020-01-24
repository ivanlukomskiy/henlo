import {Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../storage.service';
import {ModalController, Platform} from '@ionic/angular';
import {UtilsService} from '../utils/utils.service';

@Component({
    selector: 'app-translation-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {

    animationTimer: number;
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
    trashShift = 0;
    width = 500;
    @ViewChild('inputOriginal', {static: true}) inputOriginal!: any;
    @ViewChild('inputTranslation', {static: true}) inputTranslation!: any;
    ANIMATION_TICKS = 60;
    ANIMATION_DISTANCE = 200;

    textOpacity = 1;
    trashOpacity = 1;
    phase = 0;
    animationStarted = false;

    constructor(
        private ngZone: NgZone,
        private storage: StorageService,
        private utils: UtilsService,
        public modalController: ModalController,
        platform: Platform
    ) {
        const self = this;
        platform.ready().then(() => {
            self.width = platform.width();
        });
    }

    save() {
        const self = this;
        if (self.edit) {
            console.log('this.translation: ', this.translation);
            self.storage.update(this.translation)
                .then(() => {
                    self.cancel(null);
                });
        } else {
            self.storage.save(self.translation.original, self.translation.translation)
                .then(() => {
                    self.translation = {original: '', translation: ''};
                    self.focus();
                });
        }
    }

    cancel(event) {
        if (event && event.target['id'] === 'trash') {
            console.log('trash hit');
            return;
        }
        const self = this;
        self.modalController.dismiss({dismissed: true});
    }

    focus() {
        const self = this;
        setTimeout(() => {
            self.inputOriginal.setFocus();
        }, 50);
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

    sweptRight(event) {
        if (event.target['id'] === 'trash') {
            return;
        }
        const self = this;
        if (this.translation.original === '' || this.translation.original == null) {
            setTimeout(() => {
                self.inputOriginal.setFocus();
            }, 50);
        } else if (this.translation.translation === '' || this.translation.translation == null) {
            setTimeout(() => {
                self.inputTranslation.setFocus();
            }, 50);
        } else {
            this.save();
        }
    }

    handlePan(event) {
        if (this.animationStarted) {
            return;
        }
        const deltaX = event.deltaX > this.width - 140 ? this.width - 140 : event.deltaX < 0 ? 0 : event.deltaX;
        this.trashShift = deltaX;
        this.textOpacity = 1 - deltaX / (this.width - 140);
        if (event.isFinal) {
            if (this.textOpacity > 0.3) {
                this.trashShift = 0;
                this.textOpacity = 1;
            } else {
                this.textOpacity = 0;
                this.modalController.dismiss({deleted: true});
            }
        }
    }

    trashAnimation(self) {
        if (self.phase === self.ANIMATION_TICKS) {
            self.phase = 0;
            self.animationStarted = false;
            self.trashShift = 0;
            self.trashOpacity = 1;
            clearInterval(self.animationTimer);
            return;
        }
        self.trashOpacity = 1 -  self.phase / self.ANIMATION_TICKS;
        self.phase += 1;
        self.trashShift = (Math.sin(self.phase * Math.PI / 2 / self.ANIMATION_TICKS - Math.PI / 2) + 1) * self.ANIMATION_DISTANCE;
    }

    trashClicked() {
        const self = this;
        console.log('this.trashShift: ', this.trashShift);
        this.animationTimer = setInterval(() => this.trashAnimation(self), 5);
    }
}
