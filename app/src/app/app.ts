import { Component, signal } from '@angular/core';
import {VideoSection} from './components/video-section/video-section';
import {ScheduledVideos} from './components/scheduled-videos/scheduled-videos';
import {AvailableVideos} from './components/available-videos/available-videos';

@Component({
  selector: 'app-root',
  imports: [VideoSection, ScheduledVideos, AvailableVideos],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('app');

}
