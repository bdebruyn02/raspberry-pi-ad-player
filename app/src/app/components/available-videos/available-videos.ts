import { Component } from '@angular/core';
import {IVideo} from '../../interfaces/video';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-available-videos',
  imports: [MatListModule, MatButtonModule, MatIconModule],
  templateUrl: './available-videos.html',
  styleUrl: './available-videos.scss'
})
export class AvailableVideos {
  list: IVideo[] = [];

}
