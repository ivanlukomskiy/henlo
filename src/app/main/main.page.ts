import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../storage.service';
import {ModalController, Platform} from '@ionic/angular';
import {EditComponent} from '../edit/edit.component';
import {UtilsService} from '../utils/utils.service';
import {LearnPage} from '../learn/learn.page';
import {SettingsPage} from '../settings/settings.page';


@Component({
    selector: 'app-tab1',
    templateUrl: 'main.page.html',
    styleUrls: ['main.page.scss']
})
export class MainPage implements OnInit {
    objectKeys = Object.keys;

    translationsFiltered = [];
    translations = [];
    search = '';
    searchOn = false;
    translationsByDates = {};

    @ViewChild('searchInput', {static: false}) searchInput!: any;

    constructor(private storage: StorageService,
                public modalController: ModalController,
                public utils: UtilsService,
                private platform: Platform
    ) {
    }

    searchChanged(val) {
        this.search = val.detail.value;
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

    editTranslation(translation) {
        const res = this.openEditor(translation);
        console.log('res: ', res);
    }

    addTranslation(translation) {
        this.openEditor(null);
    }

    async openEditor(translation) {
        const modal = await this.modalController.create({
            component: EditComponent,
            componentProps: {
                edit: translation !== null,
                translation: translation ? Object.assign({}, translation) : {}
            }
        });
        const self = this;
        modal.onDidDismiss().then(result => {
            console.log('result: ', result);
            console.log('result.data.deleted: ', result.data.deleted);
            if (result.data.deleted) {
                self.deleteTranslation(translation);
            }
        });
        return await modal.present().then(() => {
            self.closeSearch();
        });
    }

    async openLearner() {
        const self = this;
        const modal = await this.modalController.create({
            component: LearnPage
        });
        return await modal.present().then(() => {
            self.closeSearch();
        });
    }

    ngOnInit(): void {
        const self = this;
        this.storage.subscribe(translations => {
            self.translations = translations;
            self.updateList(null);
        });
        this.platform.backButton.subscribe(() => {
            self.closeSearch();
        });
    }

    closeSearch() {
        if (this.searchOn) {
            this.searchClicked();
        }
    }

    searchClicked() {
        this.searchOn = !this.searchOn;
        if (!this.searchOn) {
            this.search = '';
            this.updateList('');
        } else {
            const self = this;
            setTimeout(() => {
                self.searchInput.setFocus();
            }, 50);
        }
    }

    async openSettings() {
        const self = this;
        const modal = await this.modalController.create({
            component: SettingsPage
        });
        return await modal.present().then(() => {
            self.closeSearch();
        });
    }
}
