/**
 * videoManager.js
 * Handles video discovery, syncing, and SQLite management
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { execSync } = require('child_process');
const { app } = require('electron');

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

// Environment-aware video directory
const VIDEO_DIR = app.isPackaged ? '/home/admin/Videos' : '/home/bdebruyn/Videos';

function connectDB() {
    return new sqlite3.Database(dbPath);
}

/**
 * Get video duration using ffprobe
 */
function getVideoDuration(filePath) {
    try {
        const cmd = `ffprobe -v error -show_entries format=duration -of csv=p=0 "${filePath}"`;
        const output = execSync(cmd).toString().trim();
        return Math.round(parseFloat(output));
    } catch (err) {
        console.warn(`Failed to get duration for ${filePath}`, err);
        return 0;
    }
}

/**
 * Sync the database with the video folder
 * - Add new files
 * - Remove missing files
 */
function syncVideos() {
    const db = connectDB();

    const files = fs.readdirSync(VIDEO_DIR)
        .filter(f => /\.(mp4|mkv|mov|avi|webm)$/i.test(f));

    db.all(`SELECT filename FROM videos`, (err, rows) => {
        if (err) return console.error(err);

        const existingFiles = rows.map(r => r.filename);
        const currentFiles = files;

        // New files to add
        const added = currentFiles.filter(f => !existingFiles.includes(f));
        // Files to remove
        const removed = existingFiles.filter(f => !currentFiles.includes(f));

        // Add new files
        added.forEach(filename => {
            const filePath = path.join(VIDEO_DIR, filename);
            const duration = getVideoDuration(filePath);
            db.run(
                `INSERT INTO videos (filename, filepath, duration) VALUES (?, ?, ?)`,
                [filename, filePath, duration],
                err => {
                    if (err) console.error(`Failed to insert ${filename}:`, err);
                    else console.log(`Added: ${filename}`);
                }
            );
        });

        // Remove missing files
        removed.forEach(filename => {
            db.run(
                `DELETE FROM videos WHERE filename = ?`,
                [filename],
                err => {
                    if (err) console.error(`Failed to remove ${filename}:`, err);
                    else console.log(`Removed: ${filename}`);
                }
            );
        });
    });

    db.close();
}

/**
 * Return all videos from the database
 */
function getVideos(callback) {
    const db = connectDB();
    const query = `SELECT * FROM videos ORDER BY filename ASC`;
    db.all(query, (err, rows) => {
        db.close();
        callback(err, rows || []);
    });
}


/**
 * Check ffprobe availability
 */
function checkFFmpeg() {
    try {
        execSync('ffprobe -version', { stdio: 'ignore' });
        return true;
    } catch {
        console.warn('⚠️ ffmpeg/ffprobe not installed. Please install with: sudo dnf install ffmpeg');
        return false;
    }
}

// Run check once at startup
checkFFmpeg();

module.exports = {
    syncVideos,
    getVideos,
};
