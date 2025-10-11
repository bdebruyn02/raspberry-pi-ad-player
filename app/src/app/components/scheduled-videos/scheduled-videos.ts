import {Component, inject, OnInit} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CommonModule} from '@angular/common';
import {DataService} from '../../services/data';
import {ISchedule} from '../../interfaces/schedule';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-scheduled-videos',
  imports: [MatListModule, MatButtonModule, MatIconModule, MatTooltipModule, CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './scheduled-videos.html',
  styleUrl: './scheduled-videos.scss'
})
export class ScheduledVideos implements OnInit {
   ds = inject(DataService);

    async ngOnInit() {
      await this.loadSchedules()
    }

    async onUpdate(schedule: ISchedule) {
      try {
        const {changes} = await this.ds.updateSchedule(schedule.id, schedule);

        if(changes) {
          await this.loadSchedules();
        }
      } catch (error) {
        console.error(error);
      }
    }

    async onDelete(id: number) {
      try {
        const {changes} = await this.ds.deleteSchedule(id);

        if(changes) {
          await this.loadSchedules();
        }
      } catch (error) {
        console.error(error);
      }
    }

    private async loadSchedules() {
      try {
        await this.ds.loadSchedule();
      } catch (error) {
        console.log(error);
      }
    }

}
