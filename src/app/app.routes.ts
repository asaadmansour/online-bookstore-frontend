import { Routes } from '@angular/router';
import { CategoriesPageComponent } from './features/categories/categories-page/categories-page';
import { AuthorsComponent } from './features/authors/authors';
import { LayoutComponent } from './main/layout/layout';
import { NotFoundComponent } from './core/not-found/not-found';
import { BookListComponent } from './features/books/book-list/book-list';
import { HomePageComponent } from './features/home/home-page/home-page';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout';
import { ManageAuthorsComponent } from './admin/manage-authors/manage-authors';
import { ManageCategoriesComponent } from './admin/manage-categories/manage-categories';
import { AuthorListComponent } from './admin/manage-authors/author-list/author-list';
import { AuthorFormComponent } from './admin/manage-authors/author-form/author-form';
import { CategoryListComponent } from './admin/manage-categories/category-list/category-list';
import { CategoryFormComponent } from './admin/manage-categories/category-form/category-form';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'home', component: HomePageComponent },
      { path: 'authors', component: AuthorsComponent },
      { path: 'authors/:id', component: AuthorsComponent },
      { path: 'categories', component: CategoriesPageComponent },
      { path: 'categories/:id', component: CategoriesPageComponent },
      { path: 'books', component: BookListComponent },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'authors' },
      {
        path: 'authors',
        component: ManageAuthorsComponent,
        children: [
          { path: '', component: AuthorListComponent },
          { path: 'new', component: AuthorFormComponent },
          { path: ':id/edit', component: AuthorFormComponent },
        ]
      },
      {
        path: 'categories',
        component: ManageCategoriesComponent,
        children: [
          { path: '', component: CategoryListComponent },
          { path: 'new', component: CategoryFormComponent },
          { path: ':id/edit', component: CategoryFormComponent },
        ]
      },
    ]
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];
