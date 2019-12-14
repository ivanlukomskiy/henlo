import {Component, OnInit} from '@angular/core';
import {StorageService} from '../storage.service';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
    translation = null;
    unveiled = false;
    started = false;

    learnDirection = 'en_ru';

    translations;

    options = [];

    constructor(private storage: StorageService) {
        // storage.getSettings()
    }

    segmentChanged(event) {
        console.log('event', event.detail.value);
    }

    tapped() {
        if (!this.unveiled) {
            this.unveiled = true;
        } else {
            this.translation = this.translations.pop();
            if (!this.translation) {
                this.reload();
            }
            this.unveiled = false;
        }
    }

    reload() {
        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }

        const _self = this;
        _self.storage.getSnapshot()
            .then(translations => {
                shuffleArray(translations);
                _self.translations = translations;
                if (!_self.translations) {
                    console.error('No translations found');
                    return;
                }
                _self.translation = _self.translations.pop();
            });
    }

    updateList() {

    }

    ngOnInit(): void {
        const _self = this;
        this.storage.subscribe(translations => {
            console.log('translations: ', translations);
            _self.translations = translations;
            _self.updateList();
        });
    }

    ionViewDidEnter() {
        this.reload();
// this.started = false;
    }
}
