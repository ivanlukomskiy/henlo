import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Tab1Page} from './tab1.page';
import {TranslationEditComponent} from '../translation-edit/translation-edit.component';
import {TranslationEditModule} from '../translation-edit/translation-edit.module';

@NgModule({
    imports: [
        TranslationEditModule,
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: Tab1Page}]),
    ],
    declarations: [
        Tab1Page
    ],
    entryComponents: [
        TranslationEditComponent
    ]
})
export class Tab1PageModule {
}
