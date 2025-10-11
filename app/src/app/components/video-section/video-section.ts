import {Component, inject, OnInit, signal} from '@angular/core';
import {IAppSettings} from '../../interfaces/appsettings';
import {DataService} from '../../services/data';

@Component({
  selector: 'app-video-section',
  imports: [],
  templateUrl: './video-section.html',
  styleUrl: './video-section.scss'
})
export class VideoSection implements OnInit {
  appSettings = signal<IAppSettings | null>(null);
  private ds = inject(DataService);

  ngOnInit(): void {
    this.loadSettings().then(() => this.appSettings = this.ds.appSettings);
  }

  private async loadSettings() {
    try {
      await this.ds.loadSettings();
    } catch (error) {
      console.log(error);
    }
  }
}
