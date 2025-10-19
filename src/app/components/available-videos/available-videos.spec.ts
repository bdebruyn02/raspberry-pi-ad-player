import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableVideos } from './available-videos';

describe('AvailableVideos', () => {
  let component: AvailableVideos;
  let fixture: ComponentFixture<AvailableVideos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableVideos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableVideos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
