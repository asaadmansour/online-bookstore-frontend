import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularAuthors } from './popular-authors';

describe('PopularAuthors', () => {
  let component: PopularAuthors;
  let fixture: ComponentFixture<PopularAuthors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularAuthors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularAuthors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
