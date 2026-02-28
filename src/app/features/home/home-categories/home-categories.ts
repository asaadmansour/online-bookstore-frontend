import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../../core/services/categories.service';
import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-home-categories',
  imports: [],
  templateUrl: './home-categories.html',
  styleUrl: './home-categories.css',
})
export class HomeCategories implements OnInit {
  private categoriesService = inject(CategoriesService);
  categories = signal<Category[]>([]);
  ngOnInit() {
    this.categoriesService.getCategories().subscribe((data) => {
      this.categories.set(data.items);
    });
  }
}
