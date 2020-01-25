import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditComponent} from './edit.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {AutosizeModule} from 'ngx-autosize';
import {FiCommonModule} from '../fi-common/fi-common.module';

@NgModule({
    declarations: [
        EditComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        AutosizeModule,
        FiCommonModule,
    ],
    exports: [
        EditComponent
    ]
})
export class EditModule {
}
