import { Component } from '@angular/core';
import { HomeImage } from '../home-image/home-image';
import { TrendingBooks } from '../trending-books/trending-books';
import { HomeCategories } from '../home-categories/home-categories';
import { PopularAuthors } from '../popular-authors/popular-authors';

@Component({
  selector: 'app-home-page',
  imports: [HomeImage, TrendingBooks, HomeCategories, PopularAuthors],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
