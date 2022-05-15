import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {StorageService} from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: StorageService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.storage.init().then(() => {
      return this.platform.ready()
    }).then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
