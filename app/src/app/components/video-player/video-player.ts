import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  viewChild,
  ViewEncapsulation
} from '@angular/core';
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
  loadingSpinner: boolean,
  errorDisplay: boolean,
  debug: boolean
}

@Component({
  selector: 'app-video-player',
  imports: [],
  templateUrl: './video-player.html',
  styleUrl: './video-player.scss',
  encapsulation: ViewEncapsulation.None,
})
export class VideoPlayer implements AfterViewInit, OnDestroy {
  target = viewChild<ElementRef>('target');
  videoSrc = input<string>();

  private options: IVideoPlayer = {
    autoplay: false,
    fluid: true, // responsive width
    aspectRatio: '16:9',
    sources: [],
    errorDisplay: false,
    loadingSpinner: false,
    debug: false,
  }
  player: VideoJsPlayer;

  constructor() {
    effect(() => {
      const src = this.videoSrc();
      if (src && this.player) {
        console.info(src);
        this.player.src({ src, type: 'video/mp4' });
        this.player.load();
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.target()) return;

    this.player = videojs(this.target()?.nativeElement, this.options);

    // Only set the source if we have a video path
    if (this.videoSrc()) {
      this.setVideoSource(this.videoSrc()!);
    }
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }

  // Helper to set video source
  private setVideoSource(src: string) {
    this.player.src({ src, type: 'video/mp4' });
    this.player.load();
    this.player.play();  // ensures autoplay starts if muted
  }
}
