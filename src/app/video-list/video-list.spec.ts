import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoListComponent } from './video-list.component';

describe('VideoList', () => {
  let component: VideoListComponent;
  let fixture: ComponentFixture<VideoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
