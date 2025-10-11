const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Video Manager
    syncVideos: () => ipcRenderer.invoke('sync-videos'),
    getVideos: () => ipcRenderer.invoke('get-videos'),

    // Schedule Manager
    getSchedules: () => ipcRenderer.invoke('get-schedules'),
    createSchedule: (data) => ipcRenderer.invoke('create-schedule', data),
    updateSchedule: (id, data) => ipcRenderer.invoke('update-schedule', id, data),
    deleteSchedule: (id) => ipcRenderer.invoke('delete-schedule', id),

    // App Settings Manager
    getSettings: () => ipcRenderer.invoke('get-settings'),
    updateSettings: (data) => ipcRenderer.invoke('update-settings', data),

    // Misc
    toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),
});