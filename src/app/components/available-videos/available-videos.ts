import {Component, inject} from '@angular/core';
import {IVideo} from '../../interfaces/video';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DataService} from '../../services/data';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CommonModule} from '@angular/common';
import {ISchedule} from '../../interfaces/schedule';

@Component({
  selector: 'app-available-videos',
  imports: [MatListModule, MatButtonModule, MatIconModule, MatTooltipModule, CommonModule],
  templateUrl: './available-videos.html',
  styleUrl: './available-videos.scss'
})
export class AvailableVideos  {
 ds = inject(DataService);

  async addToSchedule(args: IVideo) {
    const startDate = new Date();
    const endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());

    const params: Partial<ISchedule> = {
      video_id: args.id,
      start_time: startDate,
      end_time: endDate,
      max_duration: args.duration
    };

    try {
      const id = await this.ds.createSchedule(params);

      if(id) {
        await this.ds.loadSchedule(); // reloads schedule
      }
    } catch (e) {
      console.error(e);
    }
  }
}
