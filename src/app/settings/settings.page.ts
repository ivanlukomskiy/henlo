import {Component, OnInit} from '@angular/core';
import {StorageService} from '../storage.service';
import {AlertController, LoadingController, ModalController, ToastController} from '@ionic/angular';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    constructor(private storage: StorageService,
                public modalController: ModalController,
                public loadingController: LoadingController,
                public toastController: ToastController,
                public alertController: AlertController) {
    }

    backendAddress = '';

    async ngOnInit() {
        this.backendAddress = await this.storage.getProperty('backendAddress');
    }

    async clear() {
        await this.prompt('Do you really want to clear words?', 'All data will be lost',
            async () => {
                const loading = await this.loadingController.create({
                    message: 'Clearing up...',
                });
                loading.present();
                this.storage.clear().then(() => {
                    this.success('Words cleared');
                }).catch(() => {
                    this.failure('Failed to clear words');
                }).then(() => {
                    this.loadingController.dismiss();
                });
            }
        );
    }

    backendAddressChanged(event) {
        this.storage.setProperty('backendAddress', event.detail.value);
    }

    async prompt(title, text, callback) {
        const alert = await this.alertController.create({
            header: title,
            message: text,
            buttons: [
                {
                    text: 'Yes',
                    cssClass: 'secondary',
                    handler: () => {
                        callback();
                    }
                },
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                    }
                },
            ]
        });
        return alert.present();
    }

    async generate() {
        await this.prompt('Do you really want to generate new words?', 'All data will be lost',
            async () => {
                const loading = await this.loadingController.create({
                    message: 'Generating...',
                });
                loading.present();
                this.storage.generate().then(() => {
                    this.success('New words generated successfully');
                }).catch(() => {
                    this.failure('Failed to generate words');
                }).then(() => {
                    this.loadingController.dismiss();
                });
            }
        );
    }

    async sync() {
        const loading = await this.loadingController.create({
            message: 'Synchronizing...',
        });
        loading.present();
        this.storage.sync().then(() => {
            this.success('Sync successful');
        }).catch(() => {
            this.failure('Failed to sync');
        }).then(() => {
            this.loadingController.dismiss();
        });
    }

    async failure(text) {
        const toast = await this.toastController.create({
            message: text,
            duration: 2000
        });
        toast.present();
    }

    async success(text) {
        const toast = await this.toastController.create({
            message: text,
            duration: 2000
        });
        toast.present();
    }

    swipedLeft() {
        this.modalController.dismiss({dismissed: true});
    }
}
