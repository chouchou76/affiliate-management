import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KocListComponent } from './koc-list.component';

describe('KocList', () => {
  let component: KocListComponent;
  let fixture: ComponentFixture<KocListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KocListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KocListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
