import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBuilder } from './filter-builder';

describe('FilterBuilder', () => {
  let component: FilterBuilder;
  let fixture: ComponentFixture<FilterBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterBuilder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
