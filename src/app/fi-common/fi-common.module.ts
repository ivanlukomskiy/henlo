import {NgModule} from '@angular/core';
import {FiStarComponent} from './fi-star/fi-star.component';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';


@NgModule({
    declarations: [
        FiStarComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
    ],
    exports: [
        FiStarComponent
    ]
})
export class FiCommonModule {
}
