import {Component, inject, OnInit} from '@angular/core';
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
export class AvailableVideos implements OnInit {
 ds = inject(DataService);

  async ngOnInit() {
    await this.loadVideos()
  }

  async addToSchedule(args: IVideo) {

    const params: Partial<ISchedule> = {
      video_id: args.id,
      start_time: new Date(),
      end_time: new Date(),
      max_duration: args.duration
    };

    try {
      const {id} = await this.ds.createSchedule(params);

      if(id) {
        await this.ds.loadSchedule(); // reloads schedule
      }
    } catch (e) {
      console.error(e);
    }
  }

  private async loadVideos() {
    try {
      await this.ds.loadVideos();
    } catch (error) {
      console.log(error);
    }
  }
}
