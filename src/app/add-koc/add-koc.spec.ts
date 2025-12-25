import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKocComponent } from './add-koc.component';

describe('AddKoc', () => {
  let component: AddKocComponent;
  let fixture: ComponentFixture<AddKocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddKocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddKocComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
