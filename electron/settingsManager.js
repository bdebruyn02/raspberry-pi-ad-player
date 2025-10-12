/**
 * settingsManager.js
 * CRUD for app settings
 */

const path = require('path');
const {app} = require("electron");
const fs = require("fs");
const sqlite3 = require('sqlite3').verbose();

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

function connectDB() {
    return new sqlite3.Database(dbPath);
}

/**
 * Get current settings
 */
function getSettings(callback) {
    const db = connectDB();
    db.get(`SELECT * FROM app_settings WHERE id = 1`, (err, row) => {
        db.close();
        callback(err, row);
    });
}

/**
 * Update settings
 */
function updateSettings(data, callback) {
    const db = connectDB();
    const { pos_x, pos_y, width, height } = data;

    db.run(
        `UPDATE app_settings
     SET pos_x = ?, pos_y = ?, width = ?, height = ?
     WHERE id = 1`,
        [pos_x ?? 0, pos_y ?? 0, width ?? 288, height ?? 192],
        function (err) {
            db.close();
            callback(err, { changes: this?.changes });
        }
    );
}

module.exports = {
    getSettings,
    updateSettings,
};
