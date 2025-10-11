export interface ISchedule {
  id: number;
  video_id: number;
  start_time: Date;
  end_time: Date;
  max_duration: number;
  filename?: string;
  filepath?: string;
}
