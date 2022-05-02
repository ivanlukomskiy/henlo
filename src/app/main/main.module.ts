import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MainPage} from './main.page';
import {EditModule} from '../edit/edit.module';
import {LearnPageModule} from '../learn/learn.module';
import {SettingsPageModule} from '../settings/settings.module';
import {AngularD3CloudModule} from 'angular-d3-cloud';

@NgModule({
    imports: [
        EditModule,
        SettingsPageModule,
        LearnPageModule,
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{ path: '', component: MainPage }]),
        AngularD3CloudModule,
    ],
    declarations: [
        MainPage
    ]
})
export class MainPageModule {
}
