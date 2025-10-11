import {Component, inject, OnInit, signal} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CommonModule} from '@angular/common';
import {DataService} from '../../services/data';
import {ISchedule} from '../../interfaces/schedule';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-scheduled-videos',
  imports: [MatListModule, MatButtonModule, MatIconModule, MatTooltipModule, CommonModule, MatCardModule],
  templateUrl: './scheduled-videos.html',
  styleUrl: './scheduled-videos.scss'
})
export class ScheduledVideos implements OnInit {
    schedules = signal<ISchedule[]>([]);
    private ds = inject(DataService);

    ngOnInit(): void {
      this.loadSchedules().then(() => this.schedules = this.ds.schedules)
    }

    private async loadSchedules(){
      try {
        await this.ds.loadSchedule();
      } catch (error) {
        console.log(error);
      }
    }

}
