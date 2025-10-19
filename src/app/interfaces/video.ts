export interface IVideo {
  id: number;
  filename: string;
  filepath: string;
  duration: number;
}

export interface ICurrentVideo {
    id: string;
    url: string;
    type: string;
    maxDuration: number;
}
