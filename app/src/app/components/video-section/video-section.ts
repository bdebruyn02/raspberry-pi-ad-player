import {Component, inject, OnInit, signal} from '@angular/core';
import {DataService} from '../../services/data';
import {VideoPlayer} from '../video-player/video-player';

@Component({
  selector: 'app-video-section',
  imports: [VideoPlayer],
  templateUrl: './video-section.html',
  styleUrl: './video-section.scss'
})
export class VideoSection implements OnInit {
  currentSrc = signal<string | undefined>(undefined);
  ds = inject(DataService);

  private currentScheduleIndex = 0;

  async ngOnInit() {
    await this.loadSettings();
    await this.loadVideos();
    await this.loadSchedules();
  }

  private async loadSettings() {
    try {
      await this.ds.loadSettings();
    } catch (error) {
      console.log(error);
    }
  }

  private async loadVideos() {
    try {
      await this.ds.loadVideos();
    } catch (err) {
      console.error(err);
    }
  }

  private async loadSchedules() {
    try {
      await this.ds.loadSchedule();

      this.playNextSchedule();
    } catch (err) {
      console.error('Error loading schedules:', err);
    }
  }
  private playNextSchedule() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const schedules = [...this.ds.schedules() ?? []]?.sort((a, b) => a.id - b.id);

    // Filter schedules by time window
    const availableSchedules = schedules.filter(s => {
      s.start_time.setHours(0, 0, 0, 0);
      s.end_time.setHours(0, 0, 0, 0);

      return now <= s.start_time && now >= s.end_time;
    });

    if (availableSchedules.length === 0) {
      console.log('No active schedules at this time');
      return;
    }

    // Determine next schedule in sequence
    let nextIndex = availableSchedules.findIndex(
      s => s.id === schedules[this.currentScheduleIndex]?.id
    ) + 1;

    if (nextIndex >= availableSchedules.length) {
      // Repeat last schedule if at end
      nextIndex = availableSchedules.length - 1;
    }

    const nextSchedule = availableSchedules[nextIndex];
    this.currentScheduleIndex = schedules.findIndex(s => s.id === nextSchedule.id);

    console.info(`Schedule index: ${nextSchedule.id}`);

    let video = this.ds.videos()?.find(v => v.id === nextSchedule.video_id);

    if (!video) {
      return;
    }

    console.info(video.filepath);

    this.currentSrc.set(`file://${encodeURI(video.filepath)}`);
  }

  // Called when VideoPlayer emits ended or max_duration expires
  onVideoEnded() {
    console.info('Video ended');
    this.playNextSchedule();
  }
}
