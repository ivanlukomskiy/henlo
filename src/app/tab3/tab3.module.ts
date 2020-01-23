import {IonicModule, ModalController} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Tab3Page} from './tab3.page';
import {StorageService} from '../storage.service';
import {UtilsModule} from '../utils/utils.module';
import {TranslationEditComponent} from '../translation-edit/translation-edit.component';

@NgModule(
//     {
//     imports: [
//         IonicModule,
//         CommonModule,
//         FormsModule,
//         UtilsModule,
//         RouterModule.forChild([{path: '', component: Tab3Page}])
//     ],
//     declarations: [Tab3Page]
// }
    {
        declarations: [
            Tab3Page
        ],
        imports: [
            IonicModule,
            CommonModule,
            FormsModule,
        ],
        exports: [
            Tab3Page
        ]
    })
export class Tab3PageModule {
}
