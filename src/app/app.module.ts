import {NgModule} from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
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

export class CustomHammerConfig extends HammerGestureConfig {
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
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot(),
        HttpClientModule,
        BrowserAnimationsModule,
    ],
    providers: [
        StorageService,
        StatusBar,
        SplashScreen,
        [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
        [{ provide: DEFAULT_TIMEOUT, useValue: 4000 }],
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
