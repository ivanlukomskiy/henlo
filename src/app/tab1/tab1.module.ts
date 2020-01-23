import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Tab1Page} from './tab1.page';
import {TranslationEditComponent} from '../translation-edit/translation-edit.component';
import {TranslationEditModule} from '../translation-edit/translation-edit.module';
import {Tab3PageModule} from '../tab3/tab3.module';
import {Tab3Page} from '../tab3/tab3.page';
import {SettingsPage} from '../settings/settings.page';
import {SettingsPageModule} from '../settings/settings.module';

@NgModule({
    imports: [
        TranslationEditModule,
        SettingsPageModule,
        Tab3PageModule,
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: Tab1Page}]),
    ],
    declarations: [
        Tab1Page
    ],
    entryComponents: [
        TranslationEditComponent,
        Tab3Page,
        SettingsPage
    ]
})
export class Tab1PageModule {
}
