import {Injectable} from '@angular/core';
import Database from '@tauri-apps/plugin-sql';
import {ISchedule} from "../interfaces/schedule";

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    private db: Database;

    constructor() {
        this.db = new Database('sqlite:media.db');
    }

    /**
     * Create a new schedule
     */
    async createSchedule(schedule: Partial<ISchedule>): Promise<number> {
        const result = await this.db.execute(`INSERT INTO schedule (video_id, start_time, end_time, max_duration)
        VALUES (?, ?, ?, ?)`, [schedule.video_id, schedule.start_time, schedule.end_time, schedule.max_duration ?? 0,]);

        // result.lastInsertId is not guaranteed; query SQLite for last row id
        const rows = await this.db.select('SELECT last_insert_rowid() AS id') as ISchedule[];
        return rows[0].id;
    }

    /**
     * Get all schedules with joined video info
     */
    async getSchedules(): Promise<ISchedule[]> {
        return await this.db.select(`SELECT s.id, s.video_id, s.start_time, s.end_time, s.max_duration,
              v.filename, v.filepath
           FROM schedule s
           JOIN videos v ON s.video_id = v.id
           ORDER BY s.start_time ASC`);
    }

    /**
     * Update a schedule
     */
    async updateSchedule(id: number, data: Partial<ISchedule>): Promise<void> {
        await this.db.execute(`UPDATE schedule
       SET start_time = ?, end_time = ?, max_duration = ?
       WHERE id = ?`, [data.start_time, data.end_time, data.max_duration ?? 0, id]);
    }

    /**
     * Delete a schedule
     */
    async deleteSchedule(id: number): Promise<void> {
        await this.db.execute(`DELETE FROM schedule WHERE id = ?`, [id]);
    }

}
