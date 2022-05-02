import {NgModule} from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicStorageModule} from '@ionic/storage';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {StorageService} from './storage.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import * as Hammer from 'hammerjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DEFAULT_TIMEOUT, TimeoutInterceptor} from './timeout-interceptor';
import {Clipboard} from '@ionic-native/clipboard/ngx';
import { AngularD3CloudModule } from 'angular-d3-cloud'

export class CustomHammerConfig extends HammerGestureConfig {

    buildHammer(element: HTMLElement) {
        let options = {};

        if (element.attributes['data-mc-options']) {
            try {
                options = JSON.parse(element.attributes['data-mc-options'].nodeValue);
            } catch(err) {
                console.error('An error occurred when attempting to parse Hammer.js options: ', err);
            }
        }

        const mc = new Hammer(element, options);

        // keep default angular config
        mc.get('pinch').set({enable: true});
        mc.get('rotate').set({enable: true});

        // retain support for angular overrides object
        for (const eventName in this.overrides) {
            mc.get(eventName).set(this.overrides[eventName]);
        }

        return mc;
    }

    overrides = {
        pan: {
            direction: Hammer.DIRECTION_ALL
        },
        swipe: {
            direction: Hammer.DIRECTION_ALL
        }
    };
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot(),
        HttpClientModule,
        BrowserAnimationsModule,
        HammerModule,
        AngularD3CloudModule,
    ],
    providers: [
        StorageService,
        StatusBar,
        SplashScreen,
        Clipboard,
        [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
        [{ provide: DEFAULT_TIMEOUT, useValue: 4000 }],
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
