import {inject, Injectable, signal} from '@angular/core';
import {ICurrentVideo, IVideo} from '../interfaces/video';
import {ISchedule} from '../interfaces/schedule';
import {IAppSettings} from '../interfaces/appsettings';
import {VideoService} from "./videos";
import {AppSettingsService} from "./app-settings";
import {ScheduleService} from "./schedule";
import {invoke} from '@tauri-apps/api/core';
import { readFile } from '@tauri-apps/plugin-fs';


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

    private videoService = inject(VideoService);
    private appSettingsService = inject(AppSettingsService);
    private schedulesService = inject(ScheduleService);

    // Create, Delete, Edit Methods
    async syncVideos() {
        await this.videoService.syncVideos();
        await this.loadVideos();
        await this.loadSchedule();
    }

    async createSchedule(args: Partial<ISchedule>) {
        return await this.schedulesService.createSchedule(args);
    }

    async updateSchedule(id: number, data: Partial<ISchedule>) {
        return await this.schedulesService.updateSchedule(id, data);
    }

    async deleteSchedule(id: number) {
        return await this.schedulesService.deleteSchedule(id);
    }

    async updateSettings(args: Partial<IAppSettings>) {
        return await this.appSettingsService.updateSettings(args);
    }

    // Fetch methods
    async loadSchedule() {
        let data = await this.schedulesService.getSchedules();

        data = data.map(x => ({...x, start_time: new Date(x.start_time), end_time: new Date(x.end_time)}))
        this.schedules.update(() => data);
    }

    async loadVideos() {
        const data = await this.videoService.getVideos();
        this.videos.update(() => data);
    }

    async loadSettings() {
        const data = await this.appSettingsService.getSettings();
        this.appSettings.update(() => data);
    }

    async getVideoBlob(video: IVideo) {
        const bytes = await readFile(video.filepath);
        const ext = video.filename.split('.').pop()?.toLowerCase() || 'mp4';
        const mime = this.videoService.getMimeType(ext);

        const blob = new Blob([bytes], { type: mime });
        const blobUrl = URL.createObjectURL(blob);

        return { url: blobUrl, type: mime };
    }

    // MISC
    async toggleFullscreen() {
        await invoke('toggle_fullscreen');
    }
}
