import {Injectable, signal} from '@angular/core';
import {IVideo} from '../interfaces/video';
import {ISchedule} from '../interfaces/schedule';
import {IAppSettings} from '../interfaces/appsettings';
// const {syncVideos, getVideos, getSchedules, toggleFullscreen, createSchedule, updateSchedule, deleteSchedule, getSettings, updateSettings} = window.electronAPI;

interface IUpdateReturn {
  changes: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  videos = signal<IVideo[] | null>(null);
  schedules = signal<ISchedule[] | null>(null);
  appSettings = signal<IAppSettings | null>(null);

  // Create, Delete, Edit Methods
  async syncVideos() {
    // await syncVideos();
    await this.loadVideos();
    await this.loadSchedule();
  }

  async createSchedule(args: Partial<ISchedule>)  {
    return {id: 0}//await createSchedule(args);
  }

  async updateSchedule(id: number, data: Partial<ISchedule>) : Promise<IUpdateReturn> {
    return {changes: 0}//await updateSchedule(id, data);
  }

  async deleteSchedule(id: number) : Promise<IUpdateReturn> {
  return {changes: 0} //await deleteSchedule(id);
  }

  async updateSettings (args: Partial<IAppSettings>) {
  return {changes: 0}//await updateSettings(args);
  }

  // Fetch methods
  async loadSchedule() {
    let data = [] as ISchedule[];//await getSchedules() as ISchedule[];

    data = data.map(x => ({...x, start_time: new Date(x.start_time), end_time: new Date(x.end_time)}))
    this.schedules.update(() => data);
  }

  async loadVideos() {
    const data = [] as IVideo[];
    this.videos.update(() => data);
  }

  async loadSettings() {
    const data = {} as IAppSettings;
    this.appSettings.update(() => data);
  }

  // MISC
  async toggleFullscreen() {
    // await toggleFullscreen();
  }
}
