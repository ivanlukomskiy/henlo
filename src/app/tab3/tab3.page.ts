import {Component, OnInit} from '@angular/core';
import {StorageService} from '../storage.service';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
    // translation = {
    //     translation: 'Пёсель',
    //     original: 'Doggie'
    // };
    translation = null;
    unveiled = false;

    translations;

    constructor(private storage: StorageService) {
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
                console.log('this.translations', translations);
                _self.translations = translations;
                if (!_self.translations) {
                    console.error('No translations found');
                    return;
                }
                _self.translation = _self.translations.pop();
            });
    }

    ngOnInit(): void {
        this.reload();
    }
}
