import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MainPage} from './main.page';
import {TranslationEditComponent} from '../translation-edit/translation-edit.component';
import {TranslationEditModule} from '../translation-edit/translation-edit.module';
import {LearnPageModule} from '../learn/learn.module';
import {LearnPage} from '../learn/learn.page';
import {SettingsPage} from '../settings/settings.page';
import {SettingsPageModule} from '../settings/settings.module';

@NgModule({
    imports: [
        TranslationEditModule,
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
        TranslationEditComponent,
        LearnPage,
        SettingsPage
    ]
})
export class MainPageModule {
}
