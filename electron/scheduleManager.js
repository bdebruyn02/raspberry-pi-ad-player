/**
 * scheduleManager.js
 * CRUD for video schedules
 */

const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'media.db');

function connectDB() {
    return new sqlite3.Database(dbPath);
}

/**
 * Create new schedule
 */
function createSchedule(schedule, callback) {
    const db = connectDB();
    const { video_id, start_time, end_time, max_duration } = schedule;

    db.run(
        `INSERT INTO schedule (video_id, start_time, end_time, max_duration)
     VALUES (?, ?, ?, ?, ?)`,
        [video_id, start_time, end_time, max_duration || 0],
        function (err) {
            db.close()
            callback(err, { id: this?.lastID });
        }
    );
}

/**
 * Get all schedules
 */
function getSchedules(callback) {
    const db = connectDB();
    db.all(
        `SELECT s.*, v.filename, v.filepath
     FROM schedule s
     JOIN videos v ON s.video_id = v.id
     ORDER BY s.start_time ASC`,
        (err, rows) => {
            db.close();
            callback(err, rows);
        }
    );
}

/**
 * Update a schedule
 */
function updateSchedule(id, data, callback) {
    const db = connectDB();
    const { start_time, end_time, max_duration } = data;
    db.run(
        `UPDATE schedule
     SET start_time = ?, end_time = ?, max_duration = ?
     WHERE id = ?`,
        [start_time, end_time, max_duration || 0, id],
        function (err) {
            db.close();
            callback(err, { changes: this?.changes });
        }
    );
}

/**
 * Delete a schedule
 */
function deleteSchedule(id, callback) {
    const db = connectDB();
    db.run(`DELETE FROM schedule WHERE id = ?`, [id], function (err) {
        db.close();
        callback(err, { changes: this?.changes });
    });
}

module.exports = {
    createSchedule,
    getSchedules,
    updateSchedule,
    deleteSchedule,
};
