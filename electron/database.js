const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'media.db');

const tableCreate = {
    videos: `CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT,
        filepath TEXT,
        duration INTEGER
    )`,
    schedule: `CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id INTEGER,
        start_time DATETIME,
        end_time DATETIME,
        max_duration INTEGER,
        FOREIGN KEY(video_id) REFERENCES videos(id)
      )`,
    app_settings: `CREATE TABLE IF NOT EXISTS app_settings (
        id INTEGER PRIMARY KEY CHECK(id = 1),
        pos_x INTEGER DEFAULT 0,
        pos_y INTEGER DEFAULT 0,
        width INTEGER DEFAULT 640,
        height INTEGER DEFAULT 360
      )`
}

module.exports = {
    init() {
        const db = new sqlite3.Database(dbPath);

        db.serialize(() => db.run((tableCreate.videos)));
        db.serialize(() => db.run((tableCreate.schedule)));
        db.serialize(() => db.run((tableCreate.app_settings)));

        db.close();
    },
};
