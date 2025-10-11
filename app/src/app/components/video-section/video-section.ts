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

  private isElectron = window && (window as any).process && (window as any).process.type;
  private currentScheduleIndex = 0;
  private videoTimer: any;

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

    const schedules = this.ds.schedules()?.sort((a, b) => a.id - b.id) ?? [];

    // Filter schedules by time window
    const availableSchedules = schedules.filter(s => s.start_time <= now && s.end_time >= now);

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

    let video = this.ds.videos()?.find(v => v.id === nextSchedule.video_id);

    if (!video) {
      return;
    }

    // Convert path to file:// for Electron
    if (this.isElectron) {
      this.currentSrc.set(`file://${encodeURI(video.filepath)}`);
    }

    // Handle max_duration
    if (this.videoTimer) {
      clearTimeout(this.videoTimer);
    }

    this.videoTimer = setTimeout(() => this.onVideoEnded(), nextSchedule.max_duration * 1000);

  }

  // Called when VideoPlayer emits ended or max_duration expires
  onVideoEnded() {
    this.playNextSchedule();
  }
}
