import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {EditComponent} from '../edit/edit.component';
import {EditModule} from '../edit/edit.module';
import {SettingsPage} from './settings.page';

@NgModule(
//     {
//     imports: [
//         EditModule,
//         IonicModule,
//         CommonModule,
//         FormsModule,
//         RouterModule.forChild([{path: '', component: SettingsPage}]),
//     ],
//     declarations: [
//         SettingsPage
//     ],
//     entryComponents: [
//         EditComponent
//     ]
// }
    {
        declarations: [
            SettingsPage
        ],
        imports: [
            IonicModule,
            CommonModule,
            FormsModule,
        ],
        exports: [
            SettingsPage
        ]
    }
)
export class SettingsPageModule {
}
