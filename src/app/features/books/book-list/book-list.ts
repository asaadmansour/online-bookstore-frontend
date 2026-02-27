import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.html',
})
export class BookListComponent implements OnInit {

  categoryId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.categoryId = params.get('category');
      console.log('Category from route:', this.categoryId);
    });
  }
}