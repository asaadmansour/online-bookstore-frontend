import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingBooks } from './trending-books';

describe('TrendingBooks', () => {
  let component: TrendingBooks;
  let fixture: ComponentFixture<TrendingBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingBooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingBooks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
