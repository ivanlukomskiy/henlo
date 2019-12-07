import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    NgZone,
    OnInit,
    ViewChild
} from '@angular/core';
import 'rxjs-compat/add/observable/interval';
import {Storage} from '@ionic/storage';

const PAN_MIN_SHIFT = 40;

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
    col = '#000';
    mt = '190px';
    tick = 0;
    sub;
    shift = '50px';
    hintText = '';
    hintColor = '#000';
    original = '';
    translation = '';
    @ViewChild('inputOriginal', {static: true}) originalInput!: ElementRef;

    // @ViewChild('nameInput', { static: false, }) nameInputRef: ElementRef;

    constructor(
        private ngZone: NgZone,
        private storage: Storage
    ) {
    }

    save(self) {
        if (self.original === '' || self.translation === '') {
            console.log('Couldn\'t save, some fields are empty');
            return;
        }
        self.storage.get('translations')
            .then(translations => {
                const newTranslation = {
                    original: self.original,
                    translation: self.translation,
                    added: new Date()
                };
                const newTranslations = translations === null ? [newTranslation] : [newTranslation, ...translations];
                return self.storage.set('translations', newTranslations);
            })
            .then(() => {
                console.log('Saved');
                self.cancel(self);
            });
    }

    cancel(self) {
        self.ngZone.run(() => {
            self.original = '';
            self.translation = '';
        });
        self.focus(self);
    }

    focus(self) {
        setTimeout(() => { // this will make the execution after the above boolean has changed
            console.log(self.originalInput)
            self.originalInput.setFocus();
        }, 0);
    }

    panCaptured(ev, self) {
        console.log(ev.type);
        // if (!ev.hasOwnProperty('deltaX')) {
        //     return;
        // }
        if (ev.type === 'panend') {
            self.setText('', 1, self);
            if (ev.deltaX > PAN_MIN_SHIFT) {
                self.save(self);
            } else if (ev.deltaX < -PAN_MIN_SHIFT) {
                self.cancel(self);
            }
        } else if (ev.type === 'panright' && ev.deltaX > PAN_MIN_SHIFT) {
            const transparency = Math.min(1, (ev.deltaX - PAN_MIN_SHIFT) / 50)
            self.setText('Save', transparency, self);
        } else if (ev.type === 'panleft' && ev.deltaX < -PAN_MIN_SHIFT) {
            const transparency = Math.min(1, (-ev.deltaX - PAN_MIN_SHIFT) / 50)
            self.setText('Clear', transparency, self);
        } else {
            self.setText('', 1, self);
        }
    }

    setText(text, transparency, self) {
        self.ngZone.run(() => {
            self.hintText = text;
            self.hintColor = 'rgba(128, 128, 128, ' + transparency + ')';
        });
    }

    ngOnInit(): void {
        const self = this;
        // this.sub = Observable.interval(300)
        //     .subscribe(val => this.changeColor(self));

        var myElement = document.getElementById('myElement');

// create a simple instance
// by default, it only adds horizontal recognizers
        const mc = new Hammer(myElement);

// listen to events...
        mc.on('panleft panright panend', ev => self.panCaptured(ev, self));
        // _self.shift = '55px';

        self.focus(self);
        console.log('5');
    }
}
