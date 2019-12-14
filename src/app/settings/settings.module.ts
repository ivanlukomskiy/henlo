import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslationEditComponent} from '../translation-edit/translation-edit.component';
import {TranslationEditModule} from '../translation-edit/translation-edit.module';
import {SettingsPage} from './settings.page';

@NgModule({
    imports: [
        TranslationEditModule,
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: SettingsPage}]),
    ],
    declarations: [
        SettingsPage
    ],
    entryComponents: [
        TranslationEditComponent
    ]
})
export class SettingsPageModule {
}
