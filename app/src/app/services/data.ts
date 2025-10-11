import {Injectable, signal} from '@angular/core';
import {IVideo} from '../interfaces/video';

// const {ipcRenderer} = window.electronAPI('electron');
const {syncVideos, getVideos} = window.electronAPI;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  videos = signal<IVideo[]>([]);

  async syncVideos() {
    await syncVideos();
    await this.loadVideos();
  }

  async loadVideos() {
    const data = await getVideos() as IVideo[];
    console.log(data);
    this.videos.set(data);
  }
}
