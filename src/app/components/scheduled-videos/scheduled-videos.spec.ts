import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledVideos } from './scheduled-videos';

describe('ScheduledVideos', () => {
  let component: ScheduledVideos;
  let fixture: ComponentFixture<ScheduledVideos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledVideos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledVideos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
