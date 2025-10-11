interface Window {
  electronAPI: {
    syncVideos: () => Promise<any>;
    getVideos: () => Promise<any>;
    getSchedule: () => Promise<any>;
  };
}
