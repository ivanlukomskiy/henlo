import {IonicModule, ModalController} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LearnPage} from './learn.page';
import {StorageService} from '../storage.service';
import {UtilsModule} from '../utils/utils.module';
import {EditComponent} from '../edit/edit.component';
import {FiCommonModule} from '../fi-common/fi-common.module';

@NgModule(
//     {
//     imports: [
//         IonicModule,
//         FiCommonModule,
//         FormsModule,
//         UtilsModule,
//         RouterModule.forChild([{path: '', component: LearnPage}])
//     ],
//     declarations: [LearnPage]
// }
    {
        declarations: [
            LearnPage
        ],
        imports: [
            IonicModule,
            CommonModule,
            FormsModule,
            FiCommonModule,
        ],
        exports: [
            LearnPage
        ]
    })
export class LearnPageModule {
}
