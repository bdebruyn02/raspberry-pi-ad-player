export interface ISchedule {
  id: number;
  video_id: number;
  start_time: Date | number;
  end_time: Date | number;
  max_duration: number;
  filename?: string;
  filepath?: string;
}
