import {NgModule} from '@angular/core';
import {FiStarComponent} from './fi-star/fi-star.component';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FiDraftComponent} from './fi-draft/fi-draft.component';


@NgModule({
    declarations: [
        FiStarComponent,
        FiDraftComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
    ],
    exports: [
        FiStarComponent,
        FiDraftComponent
    ]
})
export class FiCommonModule {
}
