/**
 * settingsManager.js
 * CRUD for app settings
 */

const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'media.db');

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
     SET pos_x = ?, pos_y = ?, width = ?, height = ?, theme = ?
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
