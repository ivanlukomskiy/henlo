import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslationEditComponent} from './translation-edit.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {AutosizeModule} from 'ngx-autosize';

@NgModule({
    declarations: [
        TranslationEditComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        AutosizeModule,
    ],
    exports: [
        TranslationEditComponent
    ]
})
export class TranslationEditModule {
}
