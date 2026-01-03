import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortBuilder } from './sort-builder';

describe('SortBuilder', () => {
  let component: SortBuilder;
  let fixture: ComponentFixture<SortBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortBuilder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
