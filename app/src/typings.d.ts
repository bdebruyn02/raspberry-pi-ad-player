import type { IVideo } from './video.interface';
import type { ISchedule } from './schedule.interface';
import type { IAppSettings } from './settings.interface';

interface Window {
  electronAPI: {
    // Video Manager
    syncVideos: () => Promise<void>;
    getVideos: () => Promise<IVideo[]>;

    // Schedule Manager
    getSchedules: () => Promise<ISchedule[]>;
    createSchedule: (data: ISchedule) => Promise<{ id: number }>;
    updateSchedule: (id: number, data: Partial<ISchedule>) => Promise<{ changes: number }>;
    deleteSchedule: (id: number) => Promise<{ changes: number }>;

    // App Settings Manager
    getSettings: () => Promise<IAppSettings>;
    updateSettings: (data: Partial<IAppSettings>) => Promise<{ changes: number }>;

    // Misc
    toggleFullscreen: () => Promise<void>;
  };
}
