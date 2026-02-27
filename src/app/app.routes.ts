import { Routes } from '@angular/router';
import { CategoriesPageComponent } from './features/categories/categories-page/categories-page';
import { AuthorsComponent } from './features/authors/authors';
import { LayoutComponent} from './main/layout/layout';
import { NotFoundComponent} from './core/not-found/not-found';
import { HomePageComponent } from './features/home/home-page/home-page';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
          {path: '',  component: HomePageComponent},
          { path: 'home', component: HomePageComponent },
          { path: 'authors', component: AuthorsComponent },
          {path: 'authors/:id', component: AuthorsComponent},
          {path: 'categories', component: CategoriesPageComponent},
        ]
    },
   {
     path: '**',
     component: NotFoundComponent,
  }
        
];
