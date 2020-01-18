import {Component, OnInit} from '@angular/core';
import {StorageService} from '../storage.service';
import {IonItemSliding, ModalController} from '@ionic/angular';
import {Tab2Page} from '../tab2/tab2.page';
import {TranslationEditComponent} from '../translation-edit/translation-edit.component';
import {UtilsService} from '../utils/utils.service';


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

    constructor(private storage: StorageService,
                public modalController: ModalController,
                public utils: UtilsService
    ) {
    }

    searchChanged(val) {
        this.updateList(val.detail.value);
    }

    datePretty(date) {
        return this.utils.datePretty(date);
    }

    updateList(val) {
        console.log('Updating list');
        const search = val ? val : this.search;
        const regExp = new RegExp(search, 'i');

        console.log('Filtering');
        this.translationsFiltered = this.translations.filter(translation =>
            regExp.test(translation.original) || regExp.test(translation.translation));
        console.log('filtering done');
        this.translationsByDates = this.utils.sortAndGroup(this.translationsFiltered);
        console.log('sorting and groupping done');
    }

    deleteTranslation(translation) {
        this.storage.remove(translation.uuid);
    }

    editTranslation(translation, slidingItem: IonItemSliding) {
        slidingItem.close();
        this.presentModal(translation);
    }

    async presentModal(translation) {
        const modal = await this.modalController.create({
            component: TranslationEditComponent,
            componentProps: {
                edit: 'true',
                translation: Object.assign({}, translation)
            }
        });
        return await modal.present();
    }

    ngOnInit(): void {
        // this.storage.clear();
        // this.storage.generate();
        console.log('Init tab 1');
        const _self = this;
        this.storage.subscribe(translations => {
            _self.translations = translations;
            _self.updateList(null);
        });
    }
}
