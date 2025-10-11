const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    syncVideos: () => ipcRenderer.invoke('sync-videos'),
    getVideos: () => ipcRenderer.invoke('get-videos'),
    getSchedule: () => ipcRenderer.invoke('get-schedule'),
});