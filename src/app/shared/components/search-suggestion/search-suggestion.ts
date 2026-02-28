import { Component, inject, signal, Input } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { Book } from '../../models/book.model';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-suggestion',
  imports: [],
  templateUrl: './search-suggestion.html',
  styleUrl: './search-suggestion.css',
})
export class SearchSuggestion {
  router = inject(Router);
  private route = inject(ActivatedRoute);
  selectedBook = signal<string>('');
  searchService = inject(SearchService);
  suggestions = signal<Book[]>([]);
  rawQuery = signal<string>('');
  private querySubject = new Subject<string>();
  constructor() {
    this.querySubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((val) => {
          if (!val) {
            this.suggestions.set([]);
            return [];
          }
          return this.searchService.getSuggestions(val);
        }),
      )
      .subscribe((data) => {
        if (data) this.suggestions.set(data as Book[]);
      });
  }
  @Input() set query(val: string) {
    this.rawQuery.set(val);
    this.querySubject.next(val);
  }
  setBook(val: string) {
    this.router.navigate(['books'], { queryParams: { search: val } });
    this.suggestions.set([]);
  }
}
