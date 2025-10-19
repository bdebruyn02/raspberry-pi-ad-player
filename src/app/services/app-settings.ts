import {Injectable} from '@angular/core';
import Database from '@tauri-apps/plugin-sql';
import {IAppSettings} from "../interfaces/appsettings";

@Injectable({
    providedIn: 'root'
})
export class AppSettingsService {
    private db: Database;

    constructor() {
        this.db = new Database('sqlite:media.db');
    }

    /**
     * Get the current app settings
     */
    async getSettings(): Promise<IAppSettings | null> {
        const rows = await this.db.select('SELECT * FROM app_settings WHERE id = 1') as IAppSettings[];
        return rows.length ? rows[0] : null;
    }

    /**
     * Update the settings
     */
    async updateSettings(settings: Partial<IAppSettings>): Promise<void> {
        const current = await this.getSettings();

        // Apply defaults if missing
        const pos_x = settings.pos_x ?? current?.pos_x ?? 0;
        const pos_y = settings.pos_y ?? current?.pos_y ?? 0;
        const width = settings.width ?? current?.width ?? 288;
        const height = settings.height ?? current?.height ?? 192;

        if (current) {
            // Update existing row
            await this.db.execute('UPDATE app_settings SET pos_x = ?, pos_y = ?, width = ?, height = ? WHERE id = 1', [pos_x, pos_y, width, height]);
        } else {
            // Insert row if it doesn’t exist
            await this.db.execute('INSERT INTO app_settings (id, pos_x, pos_y, width, height) VALUES (1, ?, ?, ?, ?)', [pos_x, pos_y, width, height]);
        }
    }
}
