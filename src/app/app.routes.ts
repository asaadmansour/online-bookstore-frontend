import { Routes } from '@angular/router';
import { LayoutComponent} from './main/layout/layout';
import { NotFoundComponent} from './core/not-found/not-found';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
    },
   {
     path: '**',
     component: NotFoundComponent,
  }
        
];
