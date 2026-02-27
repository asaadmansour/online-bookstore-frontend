import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSuggestion } from './search-suggestion';

describe('SearchSuggestion', () => {
  let component: SearchSuggestion;
  let fixture: ComponentFixture<SearchSuggestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSuggestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchSuggestion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
