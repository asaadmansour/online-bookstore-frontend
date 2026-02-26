import { Routes } from '@angular/router';
import { AuthorsPage } from './features/authors/authors';
export const AUTHORS_ROUTES: Routes = [
  { path: 'authors', component: AuthorsPage },
];

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

