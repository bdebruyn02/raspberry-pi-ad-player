const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const sqlite3 = require('sqlite3').verbose();

// Determine DB path
let dbPath;

if (!app.isPackaged) {
    // Development mode
    dbPath = path.join(__dirname, 'media.db');
} else {
    // Production mode (packaged)
    const userDataPath = path.join(app.getPath('home'), '.config', 'mediascheduler');
    if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, { recursive: true });
    }
    dbPath = path.join(userDataPath, 'media.db');
}

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
        FOREIGN KEY(video_id) REFERENCES videos(id) ON DELETE CASCADE
      )`,
    app_settings: `CREATE TABLE IF NOT EXISTS app_settings (
        id INTEGER PRIMARY KEY CHECK(id = 1),
        pos_x INTEGER DEFAULT 0,
        pos_y INTEGER DEFAULT 0,
        width INTEGER DEFAULT 288,
        height INTEGER DEFAULT 192
      )`
}

module.exports = {
    init() {
        const db = new sqlite3.Database(dbPath);

        db.serialize(() => db.run((tableCreate.videos)));
        db.serialize(() => db.run((tableCreate.schedule)));
        db.serialize(() => db.run((tableCreate.app_settings)));

        db.get(`SELECT * FROM app_settings WHERE id = 1`, (err, row) => {
            if (!row) {
                db.run(`INSERT INTO app_settings (id) VALUES (1)`);
            }
        });

        db.close();
    },
};
