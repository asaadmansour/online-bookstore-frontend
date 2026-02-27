import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-home-categories',
  imports: [],
  templateUrl: './home-categories.html',
  styleUrl: './home-categories.css',
})
export class HomeCategories implements OnInit {
  private categoriesService = inject(CategoryService);
  categories = signal<Category[]>([]);
  ngOnInit() {
    this.categoriesService.getCategories().subscribe((data) => {
      this.categories.set(data.items);
    });
  }
}
