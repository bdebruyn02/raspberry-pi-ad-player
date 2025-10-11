import {Component, inject, OnInit, signal} from '@angular/core';
import {IVideo} from '../../interfaces/video';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DataService} from '../../services/data';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-available-videos',
  imports: [MatListModule, MatButtonModule, MatIconModule, MatTooltipModule, CommonModule],
  templateUrl: './available-videos.html',
  styleUrl: './available-videos.scss'
})
export class AvailableVideos implements OnInit {
 videos = signal<IVideo[]>([]);

 private ds = inject(DataService);

  ngOnInit(): void {
    this.loadVideos().then(() => this.videos = this.ds.videos);
  }

  async addToSchedule(args: IVideo) {
    console.info('Adding to Schedule', args);
    return null;
  }

  private async loadVideos() {
    try {
      await this.ds.loadVideos();
    } catch (error) {
      console.log(error);
    }
  }
}
