import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Tab2Page} from './tab2.page';
import {TranslationEditModule} from '../translation-edit/translation-edit.module';
import {TranslationEditComponent} from '../translation-edit/translation-edit.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslationEditModule,
        RouterModule.forChild([{path: '', component: Tab2Page}])
    ],
    declarations: [Tab2Page],
    entryComponents: [
        TranslationEditComponent
    ]
})
export class Tab2PageModule {
}
