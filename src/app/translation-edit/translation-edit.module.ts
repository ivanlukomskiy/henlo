import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslationEditComponent} from './translation-edit.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {Tab2Page} from '../tab2/tab2.page';


@NgModule({
    declarations: [
        TranslationEditComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
    ],
    exports: [
        TranslationEditComponent
    ]
})
export class TranslationEditModule {
}
