import {Component, inject} from '@angular/core';
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
export class ScheduledVideos {
    ds = inject(DataService);

    async onUpdate(schedule: ISchedule) {
        try {
            await this.ds.updateSchedule(schedule.id, schedule);

            await this.ds.loadSchedule();
        } catch (error) {
            console.error(error);
        }
    }

    async onDelete(id: number) {
        try {
            await this.ds.deleteSchedule(id);

            await this.ds.loadSchedule();
        } catch (error) {
            console.error(error);
        }
    }
}
