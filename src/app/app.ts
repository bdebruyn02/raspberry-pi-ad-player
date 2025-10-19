import {Component, inject, OnInit, signal} from '@angular/core';
import {VideoSection} from './components/video-section/video-section';
import {ScheduledVideos} from './components/scheduled-videos/scheduled-videos';
import {AvailableVideos} from './components/available-videos/available-videos';
import {DataService} from './services/data';

@Component({
  selector: 'app-root',
  imports: [VideoSection, ScheduledVideos, AvailableVideos],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('app');

  private ds = inject(DataService);

  async ngOnInit() {
    await Promise.all([this.ds.loadVideos(), this.ds.loadSchedule(), this.ds.loadSettings()])
  }
}
