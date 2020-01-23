import {Component, OnInit} from '@angular/core';
import {StorageService} from '../storage.service';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    constructor(private storage: StorageService,
                public modalController: ModalController) {
    }

    ngOnInit() {
    }

    clear() {
        this.storage.clear();
    }

    sync() {
        this.storage.sync();
    }

    swipedLeft() {
        this.modalController.dismiss({dismissed: true});
    }
}
