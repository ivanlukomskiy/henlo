import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MainPage} from './main.page';
import {EditComponent} from '../edit/edit.component';
import {EditModule} from '../edit/edit.module';
import {LearnPageModule} from '../learn/learn.module';
import {LearnPage} from '../learn/learn.page';
import {SettingsPage} from '../settings/settings.page';
import {SettingsPageModule} from '../settings/settings.module';

@NgModule({
    imports: [
        EditModule,
        SettingsPageModule,
        LearnPageModule,
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: MainPage}]),
    ],
    declarations: [
        MainPage
    ],
    entryComponents: [
        EditComponent,
        LearnPage,
        SettingsPage
    ]
})
export class MainPageModule {
}
