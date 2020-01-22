import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {Tab1Page} from './tab1/tab1.page';


const routes: Routes = [
    {
        path: '',
        // component: Tab1Page,
        loadChildren: () => import('./tab1/tab1.module').then(m => m.Tab1PageModule)
        // loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
