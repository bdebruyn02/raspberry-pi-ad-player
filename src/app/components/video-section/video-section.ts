import {Component, effect, inject, signal} from '@angular/core';
import {DataService} from '../../services/data';
import {VideoPlayer} from '../video-player/video-player';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {DialogData, SettingsDialog} from '../settings-dialog/settings-dialog';
import {IAppSettings} from '../../interfaces/appsettings';
import {ICurrentVideo} from "../../interfaces/video";


@Component({
    selector: 'app-video-section',
    imports: [VideoPlayer, MatButtonModule, MatIconModule,],
    templateUrl: './video-section.html',
    styleUrl: './video-section.scss'
})
export class VideoSection {
    currentVideo = signal<ICurrentVideo | undefined>(undefined);
    ds = inject(DataService);

    private readonly dialog = inject(MatDialog);
    private currentId?: number;

    constructor() {
        effect(async () => {
            if (this.ds.schedules()) {
                this.playNextSchedule();
            }
        });
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(SettingsDialog, {
            data: {settings: {...this.ds.appSettings()}} as DialogData,
        });

        dialogRef.afterClosed().subscribe(async (result: IAppSettings) => {
            if (result !== undefined) {
                await this.ds.updateSettings(result);

                this.ds.appSettings.update(() => result);
            }
        });
    }

    // Called when VideoPlayer emits ended or max_duration expires
    onVideoEnded() {
        this.playNextSchedule();
    }

    private playNextSchedule() {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const schedules = this.ds.schedules()?.sort((a, b) => a.id - b.id) ?? [];

        // Filter schedules by time window
        const availableSchedules = schedules.filter(s => {
            const start = s.start_time;
            const end = s.end_time;

            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);

            return now >= start && now <= end;
        });

        if (availableSchedules.length === 0) {
            console.info('No active schedules at this time');
            return;
        }

        const ids = availableSchedules.map(s => s.id);

        if (!this.currentId) {
            this.currentId = ids[0]; // get the first one
        } else {
            this.currentId = this.getNextId(ids, this.currentId) ?? ids[0];
        }
        const nextSchedule = availableSchedules.find(x => x.id === this.currentId)!;

        let video = this.ds.videos()?.find(v => v.id === nextSchedule.video_id);

        if (!video) {
            return;
        }
        const id = `${video.filename}_${this.generateRandomString(8)}`;

        this.ds.getVideoBlob(video).then(metaData => {
            this.currentVideo.update(() => ({
                id: id,
                url: metaData.url,
                type: metaData.type,
                maxDuration: nextSchedule.max_duration
            }));
        });
    }

    private getNextId(ids: number[], currentId: number) {
        const index = ids.indexOf(currentId);
        if (index === -1) return null; // not found
        return ids[(index + 1) % ids.length];
    }

    private generateRandomString(length: number = 5): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };
}
