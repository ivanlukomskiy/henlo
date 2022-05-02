import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
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
    subtitle = 'just one moment ... ';
    modalOpened = false;
    viewModes = [
        {
            label: 'All',
            icon: 'list-outline',
            showDates: true,
            modeFilter: translation => translation.original !== '' && translation.translation !== ''
        },
        {
            label: 'Starred',
            icon: 'star',
            showDates: false,
            modeFilter: translation => translation.starred
        },
        {
            label: 'Drafts',
            icon: 'create-outline',
            showDates: false,
            modeFilter: translation => translation.original === '' || translation.translation === ''
        },
    ];
    selectedMode = this.viewModes[0];
    data = [
        "Hello", "world", "normally", "you", "want", "more", "words",
        "than", "this"].map(function (d) {
        return { text: d, value: 10 + Math.random() * 90};
    })
    public innerWidth: any;
    onWorkClick(event) {

    }
    wordColor(word: any, index: number) {
        return 'black'
    }
    wordSize(word: any, idx: number) {
        return (50 - Math.min(word.text.length, 30)) * (Math.random() * 0.2 + 0.9) * 0.4;
    }
    getTranslations(dateString: string) {
        return this.translationsByDates[dateString].translations.map(tr => {
            return {text: tr.original, value: 10 + Math.random() * 90}})
    }

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        console.log('this.modalOpened: ', this.modalOpened);
        if (this.modalOpened) {
            return;
        }
        if (event.key === '1') {
            this.searchClicked();
        } else if (event.key === '2') {
            this.addTranslation();
        } else if (event.key === '3') {
            this.openLearner();
        } else if (event.key === '4') {
            this.openSettings();
        } else if (event.key === 'ArrowLeft') {
            this.swiped(-1);
        } else if (event.key === 'ArrowRight') {
            this.swiped(1);
        }
    }

    searchKeyPress(event) {
        console.log('search key press');
        if (event.key === 'Escape') {
            this.search = '';
            this.searchOn = false;
            this.updateList('');
        }
        event.stopPropagation();
        event.stopImmediatePropagation();
    }

    @ViewChild('searchInput', {static: false}) searchInput!: any;

    constructor(public storage: StorageService,
                public modalController: ModalController,
                public utils: UtilsService,
                private platform: Platform
    ) {
    }

    getSubtitleText(stats) {
        if (this.selectedMode.label === 'starred') {
            const starredWordsCount = this.translationsFiltered.length;
            if (starredWordsCount === 0) {
                return 'You haven\'t starred any words yet';
            }
            if (starredWordsCount === 1) {
                return 'You\'ve starred one word';
            }
            return 'You have ' + starredWordsCount + ' starred words';
        } else if (this.selectedMode.label === 'drafts') {
            const draftsCount = this.translationsFiltered.length;
            if (draftsCount === 0) {
                return 'No drafts found';
            }
            if (draftsCount === 1) {
                return 'You have one draft';
            }
            return 'You have ' + draftsCount + ' drafts';
        }
        if (stats.translationsThisDay > 0) {
            return this.getAmountOfWordsText(stats.translationsThisDay) + ' today';
        }
        if (stats.translationsThisMonth > 0) {
            return this.getAmountOfWordsText(stats.translationsThisMonth) + ' this month';
        }
        if (stats.translationsThisYear > 0) {
            return this.getAmountOfWordsText(stats.translationsThisYear) + ' this year';
        }
        if (stats.translationsTotal > 0) {
            return this.getAmountOfWordsText(stats.translationsTotal) + ' in total';
        }
        return 'You haven\'t learn any words yet';
    }

    swiped(d) {
        const viewIndex = this.viewModes.indexOf(this.selectedMode);
        const newIndex = viewIndex + d;
        if (newIndex < 0 || newIndex > this.viewModes.length - 1) {
            return;
        }
        this.selectedMode = this.viewModes[newIndex];
        this.updateList(null);
    }

    getAmountOfWordsText(n) {
        if (n === 1) {
            return 'You\'ve learned one word';
        } else {
            return 'You\'ve learned ' + n + ' words';
        }
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
        const viewModeFilter = this.selectedMode.modeFilter;
        const search = val ? val : this.search;
        const regExp = new RegExp(search, 'i');

        console.log('Filtering');
        this.translationsFiltered = this.translations
            .filter(translation => regExp.test(translation.original) || regExp.test(translation.translation))
            .filter(translation => !translation.deleted)
            .filter(viewModeFilter);
        console.log('filtering done');
        const organized = this.utils.organize(this.translationsFiltered);
        this.subtitle = this.getSubtitleText(organized.stats);
        this.translationsByDates = organized.translationsByDates;
        console.log('sorting and groupping done');
    }

    deleteTranslation(translation) {
        this.storage.remove(translation.uuid);
    }

    editTranslation(translation) {
        const res = this.openEditor(translation);
        console.log('res: ', res);
    }

    addTranslation() {
        this.openEditor(null);
    }

    async openEditor(translation) {
        const self = this;
        self.modalOpened = true;
        const modal = await this.modalController.create({
            component: EditComponent,
            componentProps: {
                edit: translation !== null,
                draftMode: self.selectedMode.label === 'drafts',
                translation: translation ? Object.assign({}, translation) :
                    {
                        original: '',
                        translation: '',
                        starred: false
                    }
            }
        });
        modal.onDidDismiss().then(result => {
            if (result.data && result.data.deleted) {
                self.deleteTranslation(translation);
            }
            self.modalOpened = false;
        });
        return await modal.present().then(() => {
            self.closeSearch();
        });
    }

    async openLearner() {
        const self = this;
        this.modalOpened = true;
        const modal = await this.modalController.create({
            component: LearnPage
        });
        modal.onDidDismiss().then(result => {
            self.modalOpened = false;
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
        this.innerWidth = window.innerWidth;
    }

    @HostListener('window:resize', ['$event'])
    onResize(_) {
        this.innerWidth = window.innerWidth;
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
        self.modalOpened = true;
        const modal = await this.modalController.create({
            component: SettingsPage
        });
        modal.onDidDismiss().then(result => {
            self.modalOpened = false;
        });
        return await modal.present().then(() => {
            self.closeSearch();
        });
    }
}
