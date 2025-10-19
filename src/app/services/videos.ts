import {Injectable} from '@angular/core';
import {invoke} from '@tauri-apps/api/core';
import Database from '@tauri-apps/plugin-sql';
import {IVideo} from "../interfaces/video";

interface IVideoFile {
    filename: string;
    filepath: string;
    duration: number;
}

@Injectable({
    providedIn: 'root'
})
export class VideoService {
    private db: Database;

    constructor() {
        this.db = new Database('sqlite:media.db');
    }

    /**
     * Sync the Videos folder with the database
     */
    async syncVideos(): Promise<IVideoFile[]> {
        // 1. Get all video files from Rust (Videos folder)
        const files: IVideoFile[] = await invoke('get_videos');

        // 2. Get existing videos from DB
        const existing: IVideoFile[] = await this.db.select('SELECT filename FROM videos');

        // 3. Determine added and removed files
        const added = files.filter(f => !existing.some(e => e.filename === f.filename));
        const removed = existing.filter(e => !files.some(f => f.filename === e.filename));

        // 4. Insert new files
        for (const file of added) {
            await this.db.execute('INSERT INTO videos (filename, filepath, duration) VALUES (?, ?, ?)', [file.filename, file.filepath, file.duration]);
        }

        // 5. Remove deleted files
        for (const file of removed) {
            await this.db.execute('DELETE FROM videos WHERE filename = ?', [file.filename]);
        }

        // Return the updated list
        return await this.db.select('SELECT * FROM videos ORDER BY filename ASC');
    }

    /**
     * Get all videos from the database
     */
    async getVideos(): Promise<IVideo[]> {
        return await this.db.select('SELECT * FROM videos ORDER BY filename ASC');
    }

    getMimeType(ext: string): string {
        switch (ext) {
            case 'mp4': return 'video/mp4';
            case 'mov': return 'video/quicktime';
            case 'mkv': return 'video/x-matroska';
            case 'webm': return 'video/webm';
            case 'avi': return 'video/x-msvideo';
            default: return 'video/mp4';
        }
    }
}
