import {Injectable, signal} from '@angular/core';
import {IVideo} from '../interfaces/video';
import {ISchedule} from '../interfaces/schedule';
import {IAppSettings} from '../interfaces/appsettings';
const {syncVideos, getVideos, getSchedules, toggleFullscreen, createSchedule, updateSchedule, deleteSchedule, getSettings, updateSettings} = window.electronAPI;

interface IUpdateReturn {
  changes: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  videos = signal<IVideo[]>([]);
  schedules = signal<ISchedule[]>([]);
  appSettings = signal<IAppSettings | null>(null);

  // Create, Delete, Edit Methods
  async syncVideos() {
    await syncVideos();
    await this.loadVideos();
  }

  async createSchedule(args: Partial<ISchedule>)  {
    return await createSchedule(args);
  }

  async updateSchedule(id: number, data: Partial<ISchedule>) : Promise<IUpdateReturn> {
    return await updateSchedule(id, data);
  }

  async deleteSchedule(id: number) : Promise<IUpdateReturn> {
    return await deleteSchedule(id);
  }

  async updateSettings (args: Partial<IAppSettings>) {
    return await updateSettings(args);
  }

  // Fetch methods
  async loadSchedule() {
    const data = await getSchedules() as ISchedule[];
    this.schedules.set(data);
  }

  async loadVideos() {
    const data = await getVideos() as IVideo[];
    this.videos.set(data);
  }

  async loadSettings() {
    const data = await getSettings() as IAppSettings;
    this.appSettings.set(data);
  }

  // MISC
  async toggleFullscreen() {
    await toggleFullscreen();
  }
}
