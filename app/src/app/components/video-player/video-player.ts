import {AfterViewInit, Component, effect, ElementRef, input, OnDestroy, viewChild} from '@angular/core';
// @ts-ignore
import videojs, {VideoJsPlayer} from 'video.js';

export interface IVideoPlayer {
  fluid: boolean,
  aspectRatio: string,
  autoplay: boolean,
  sources: {
    src: string,
    type: string,
  }[],
}

@Component({
  selector: 'app-video-player',
  imports: [],
  templateUrl: './video-player.html',
  styleUrl: './video-player.scss'
})
export class VideoPlayer implements AfterViewInit, OnDestroy {
  target = viewChild<ElementRef>('target');
  videoSrc = input.required<string>();

  private options: IVideoPlayer = {
    autoplay: false,
    fluid: true, // responsive width
    aspectRatio: '16:9',
    sources: []
  }
  player: VideoJsPlayer;

  constructor() {
    effect(() => {
      if (this.videoSrc()) {
        const src = this.videoSrc();
        this.player.src({src, type: 'video/mp4' });
        this.player.load();
      }
    });
  }

  ngAfterViewInit(): void {
    this.player = videojs(this.target()?.nativeElement.target, this.options);
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }

  // Optional helper to preload next video
  preloadNextVideo(src: string) {
    const tempVideo = document.createElement('video');
    tempVideo.src = src;
    tempVideo.preload = 'auto';
  }
}
