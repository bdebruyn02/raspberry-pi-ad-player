import {Component, effect, inject, signal} from '@angular/core';
import {DataService} from '../../services/data';
import {VideoPlayer} from '../video-player/video-player';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-video-section',
  imports: [VideoPlayer, MatButtonModule, MatIconModule,],
  templateUrl: './video-section.html',
  styleUrl: './video-section.scss'
})
export class VideoSection {
  currentSrc = signal<string | undefined>(undefined);
  ds = inject(DataService);

  private currentId?: number;

  constructor() {
    effect(() => {
      if(this.ds.schedules()) {
        console.info("test")
        this.playNextSchedule();
      }
    });
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
      console.info('No active schedules at this time');
      return;
    }

    const ids = availableSchedules.map(s => s.id);

    if (!this.currentId) {
      this.currentId = ids[0]; // get the first one
    } else {
      this.currentId  = this.getNextId(ids, this.currentId) ?? ids[0];
    }
    const nextSchedule = availableSchedules.find(x => x.id === this.currentId)!;

    let video = this.ds.videos()?.find(v => v.id === nextSchedule.video_id);

    if (!video) {
      return;
    }

    this.currentSrc.update(() => `file://${encodeURI(video.filepath)}`);
  }

  // Called when VideoPlayer emits ended or max_duration expires
  onVideoEnded() {
    this.playNextSchedule();
  }

  private getNextId(ids: number[], currentId: number) {
    const index = ids.indexOf(currentId);
    if (index === -1) return null; // not found
    return ids[(index + 1) % ids.length];
  }
}
