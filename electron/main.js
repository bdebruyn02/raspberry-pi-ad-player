const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('./database');
const VideoManager = require('./videoManager');

const isDev = !app.isPackaged; // Detect dev mode (when using ng serve)
let mainWindow;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: !isDev, // allow dev server from localhost
            nodeIntegration: true
        },
    });

    if (isDev) {
        // When running ng serve
        await mainWindow.loadURL('http://localhost:4200');
        mainWindow.webContents.openDevTools(); // optional
    } else {
        // When running the built app
        const indexPath = path.join(__dirname, '../app/dist/app/browser/index.html');
        await mainWindow.loadFile(indexPath);
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(async () => {
    Database.init();
    await createWindow();
});

ipcMain.handle('sync-videos', async () => {
    VideoManager.syncVideos();
    return true;
});

ipcMain.handle('get-videos', async () => {
    return new Promise((resolve, reject) => {
        VideoManager.getVideos((err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
