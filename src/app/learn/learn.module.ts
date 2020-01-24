import {IonicModule, ModalController} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LearnPage} from './learn.page';
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
        ],
        exports: [
            LearnPage
        ]
    })
export class LearnPageModule {
}
