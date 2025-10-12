const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('./database');
const videoManager = require('./videoManager');
const scheduleManager = require('./scheduleManager');
const settingsManager = require('./settingsManager');
let mainWindow;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: false,
            backgroundThrottling: false, // keeps timers active even in background
        },
    });
    const isPackaged = app.isPackaged ?? false;

    const indexPath = app.isPackaged
        ? path.join(__dirname, '../app/dist/app/browser/index.html')
        : 'http://localhost:4200';

    if (isPackaged) {
        mainWindow.setKiosk(true);
        await mainWindow.loadFile(indexPath);
    } else {
        await mainWindow.loadURL(indexPath);
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(async () => {
    Database.init();
    await createWindow();
});

app.commandLine.appendSwitch('ignore-gpu-blacklist');


// Video Calls
// Sync Videos
ipcMain.handle('sync-videos', async () => {
    videoManager.syncVideos();
    return true;
});

// Get all videos
ipcMain.handle('get-videos', async () => {
    return new Promise((resolve, reject) => {
        videoManager.getVideos((err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

// Schedule Calls
// Get all schedules
ipcMain.handle('get-schedules', async () => {
    return new Promise((resolve, reject) => {
        scheduleManager.getSchedules((err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

// Create a new schedule
ipcMain.handle('create-schedule', async (_, data) => {
    return new Promise((resolve, reject) => {
        scheduleManager.createSchedule(data, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
});

// Update an existing schedule
ipcMain.handle('update-schedule', async (_, id, data) => {
    return new Promise((resolve, reject) => {
        scheduleManager.updateSchedule(id, data, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
});

// Delete a schedule
ipcMain.handle('delete-schedule', async (_, id) => {
    return new Promise((resolve, reject) => {
        scheduleManager.deleteSchedule(id, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
});

// Settings Calls
// Get app settings
ipcMain.handle('get-settings', async () => {
    return new Promise((resolve, reject) => {
        settingsManager.getSettings((err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
});

// Update app settings
ipcMain.handle('update-settings', async (_, data) => {
    return new Promise((resolve, reject) => {
        settingsManager.updateSettings(data, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
});

// Misc
ipcMain.handle('toggle-fullscreen', () => {
    if (mainWindow.isFullScreen()) {
        mainWindow.setFullScreen(false);
    } else {
        mainWindow.setFullScreen(true);
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
