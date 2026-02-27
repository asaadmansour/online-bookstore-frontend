import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeImage } from './home-image';

describe('HomeImage', () => {
  let component: HomeImage;
  let fixture: ComponentFixture<HomeImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeImage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
