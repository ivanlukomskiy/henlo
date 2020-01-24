import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditComponent} from './edit.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {AutosizeModule} from 'ngx-autosize';

@NgModule({
    declarations: [
        EditComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        AutosizeModule,
    ],
    exports: [
        EditComponent
    ]
})
export class EditModule {
}
