import {Injectable, signal} from '@angular/core';
import {IVideo} from '../interfaces/video';
import {ISchedule} from '../interfaces/schedule';
const {syncVideos, getVideos, getSchedule, toggleFullscreen} = window.electronAPI;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  videos = signal<IVideo[]>([]);
  schedules = signal<ISchedule[]>([]);

  // toggles
  async toggleFullscreen() {
    await toggleFullscreen();
  }

  // Create, Delete, Edit Methods
  async syncVideos() {
    await syncVideos();
    await this.loadVideos();
  }

  // Fetch methods
  async loadSchedule() {
    const data = await getSchedule() as ISchedule[];
    this.schedules.set(data);
  }

  async loadVideos() {
    const data = await getVideos() as IVideo[];
    this.videos.set(data);
  }
}
