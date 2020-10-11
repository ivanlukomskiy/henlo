import {Component, OnInit} from '@angular/core';
import {StorageService} from '../storage.service';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    constructor(private storage: StorageService,
                public modalController: ModalController,
                public loadingController: LoadingController,
                public toastController: ToastController) {
    }

    ngOnInit() {
    }

    clear() {
        this.storage.clear();
    }

    generate() {
        this.storage.generate();
    }

    async sync() {
        const loading = await this.loadingController.create({
            message: 'Synchronizing...',
        });
        loading.present();
        this.storage.sync().then(() => {
            this.success();
        }).catch(() => {
            this.failure();
        }).then(() => {
            this.loadingController.dismiss();
        });
    }

    async failure() {
        const toast = await this.toastController.create({
            message: 'Failed to synchronize',
            duration: 2000
        });
        toast.present();
    }

    async success() {
        const toast = await this.toastController.create({
            message: 'Synchronized successfully!',
            duration: 2000
        });
        toast.present();
    }

    swipedLeft() {
        this.modalController.dismiss({dismissed: true});
    }
}
