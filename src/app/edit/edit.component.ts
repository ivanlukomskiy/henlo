import {Component, HostListener, Input, NgZone, OnInit, ViewChild} from '@angular/core';
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
    @Input() translation;
    @Input() draftMode = false;
    translationsNumber = 0;
    tick = 0;
    shift = '50px';
    trashShift = 0;
    width = 500;
    @ViewChild('inputOriginal', {static: true}) inputOriginal!: any;
    @ViewChild('inputTranslation', {static: true}) inputTranslation!: any;
    ANIMATION_TICKS = 60;
    ANIMATION_DISTANCE = 200;

    textOpacity = 1;
    trashOpacity = 1;
    editDraft = false;
    phase = 0;
    animationStarted = false;
    TRASH_ICON_SIZE = 40;
    TRASH_ICON_MARGIN = 20;
    trashSlideMaxDistance = 400;

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
            self.trashSlideMaxDistance = self.width - self.TRASH_ICON_SIZE - 2 * self.TRASH_ICON_MARGIN;
        });
    }

    ngOnInit(): void {
        const self = this;
        this.storage.subscribe(translations => {
            self.translationsNumber = self.utils.countTodayTranslations(translations);
        });
        if (this.edit && this.utils.isDraft(this.translation)) {
            this.draftMode = true;
            this.editDraft = true;
        }
        if (!this.edit) {
            this.focusOriginal();
        }
    }

    save() {
        const self = this;
        if (self.edit) {
            // update creation time when transition from draft to translation
            const updateCreation = this.editDraft && !this.utils.isDraft(this.translation);
            self.storage.update(this.translation, updateCreation)
                .then(() => {
                    self.cancel(null);
                });
        } else {
            self.storage.save(self.translation.original, self.translation.translation, self.translation.starred)
                .then(() => {
                    self.translation = {original: '', translation: '', starred: false};
                    self.focusOriginal();
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

    focusOriginal() {
        const self = this;
        setTimeout(() => {
            self.inputOriginal.setFocus();
        }, 50);
    }

    focusTranslation() {
        const self = this;
        setTimeout(() => {
            self.inputTranslation.setFocus();
        }, 50);
    }

    deleteItem() {
        this.modalController.dismiss({deleted: true});
    }

    sweptRight(event) {
        if (event && event.target['id'] === 'trash') {
            return;
        }
        const self = this;
        if (this.translation.original === '' || this.translation.original == null) {
            self.focusOriginal();
            return;
        }
        if (!this.draftMode && (this.translation.translation === '' || this.translation.translation == null)) {
            self.focusTranslation();
            return;
        }
        this.save();
    }

    handlePan(event) {
        if (this.animationStarted) {
            return;
        }
        const deltaX = event.deltaX > this.trashSlideMaxDistance ? this.trashSlideMaxDistance : event.deltaX < 0 ? 0 : event.deltaX;
        this.trashShift = deltaX;
        this.textOpacity = 1 - deltaX / this.trashSlideMaxDistance;
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
        self.trashOpacity = 1 - self.phase / self.ANIMATION_TICKS;
        self.phase += 1;
        self.trashShift = (Math.sin(self.phase * Math.PI / 2 / self.ANIMATION_TICKS - Math.PI / 2) + 1) * self.ANIMATION_DISTANCE;
    }

    trashClicked() {
        const self = this;
        this.animationTimer = setInterval(() => this.trashAnimation(self), 5);
    }

    sweptVertically(event) {
        console.log('this.translation: ', this.translation);
        if (event.target['id'] === 'trash') {
            return;
        }
        if (this.utils.isDraft(this.translation)) {
            console.log('switch draft mode');
            this.draftMode = !this.draftMode;
            if (this.draftMode) {
                if (this.translation.original === '') {
                    this.translation.original = this.translation.translation;
                }
                this.translation.translation = '';
            } else {
                if (!this.utils.isEnglish(this.translation.original)) {
                    this.translation.translation = this.translation.original;
                    this.translation.original = '';
                }
                if (this.translation.original === '') {
                    this.focusOriginal();
                } else {
                    this.focusTranslation();
                }
            }
            return;
        }
        if (!this.edit) {
            return;
        }
        if (this.translation.hasOwnProperty('starred') && this.translation.starred) {
            this.translation.starred = false;
            this.storage.starTranslation(this.translation['uuid'], false);
        } else {
            this.translation.starred = true;
            this.storage.starTranslation(this.translation['uuid'], true);
        }
    }

    onKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sweptRight(null);
        }
    }
}
