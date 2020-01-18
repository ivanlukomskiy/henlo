import {Component, OnInit} from '@angular/core';
import {StorageService} from '../storage.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    constructor(private storage: StorageService) {
    }

    ngOnInit() {
    }

    clear() {
        this.storage.clear();
    }

    sync() {
        this.storage.sync();
    }
}
