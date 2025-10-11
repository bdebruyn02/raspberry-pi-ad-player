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

  private currentId?: number;

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
    const availableSchedules = schedules.filter(s => {
      const start = s.start_time;
      const end = s.end_time;

      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);

      return now >= start && now <= end;
    });

    if (availableSchedules.length === 0) {
      console.log('No active schedules at this time');
      return;
    }
    console.info(availableSchedules);

    const ids = availableSchedules.map(s => s.id);
    console.info(ids)

    if (!this.currentId) {
      this.currentId = ids[0]; // get the first one
    } else {
      this.currentId  = this.getNextId(ids, this.currentId) ?? ids[0];
    }

    console.info(this.currentId);

    const nextSchedule = availableSchedules.find(x => x.id === this.currentId)!;

    let video = this.ds.videos()?.find(v => v.id === nextSchedule.video_id);

    if (!video) {
      return;
    }

    this.currentSrc.update(() => `file://${encodeURI(video.filepath)}`);

    // Determine next schedule in sequence
    // let nextIndex = availableSchedules.findIndex(
    //   s => s.id === schedules[this.currentScheduleIndex]?.id
    // ) + 1;
    //
    // if (nextIndex >= availableSchedules.length) {
    //   // Repeat last schedule if at end
    //   nextIndex = availableSchedules.length - 1;
    // }
    //
    // const nextSchedule = availableSchedules[nextIndex];
    // this.currentScheduleIndex = schedules.findIndex(s => s.id === nextSchedule.id);
    //
    // console.info(`Schedule index: ${nextSchedule.id}`);
    //
    // let video = this.ds.videos()?.find(v => v.id === nextSchedule.video_id);
    //
    // if (!video) {
    //   return;
    // }
    //
    // this.currentSrc.update(() => `file://${encodeURI(video.filepath)}`);
  }

  private getNextId(ids: number[], currentId: number) {
    const index = ids.indexOf(currentId);
    if (index === -1) return null; // not found
    return ids[(index + 1) % ids.length];
  }

  // Called when VideoPlayer emits ended or max_duration expires
  onVideoEnded() {
    console.info('Video ended');
    this.playNextSchedule();
  }
}
