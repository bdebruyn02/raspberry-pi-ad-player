interface Window {
  electronAPI: {
    // Video Manager
    syncVideos: () => Promise<void>;
    getVideos: () => Promise<object[]>;

    // Schedule Manager
    getSchedules: () => Promise<object[]>;
    createSchedule: (data: object) => Promise<{ id: number }>;
    updateSchedule: (id: number, data: Partial<object>) => Promise<{ changes: number }>;
    deleteSchedule: (id: number) => Promise<{ changes: number }>;

    // App Settings Manager
    getSettings: () => Promise<object>;
    updateSettings: (data: Partial<object>) => Promise<{ changes: number }>;

    // Misc
    toggleFullscreen: () => Promise<void>;
  };
}
