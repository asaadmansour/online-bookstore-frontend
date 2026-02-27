import { Component, inject, signal, Input } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { Book } from '../../models/book.model';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-search-suggestion',
  imports: [],
  templateUrl: './search-suggestion.html',
  styleUrl: './search-suggestion.css',
})
export class SearchSuggestion {
  selectedBook = signal<string>('');
  searchService = inject(SearchService);
  suggestions = signal<Book[]>([]);
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
    this.querySubject.next(val);
  }
  setBook(val: string) {
    this.selectedBook.set(val);
    console.log(val);
  }
}
