import {
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy, output, signal,
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
export class VideoPlayer implements OnDestroy {
  target = viewChild<ElementRef>('target');
  videoSrc = input<string>();
  playerCreated = signal<boolean>(false)
  ended = output();

  private options: IVideoPlayer = {
    autoplay: false,
    fluid: true, // responsive width
    aspectRatio: '3:2',
    sources: [],
    errorDisplay: false,
    loadingSpinner: false,
    debug: false,
  }

  player?: VideoJsPlayer;

  constructor() {
    effect(() => {
      console.info(this.videoSrc(), this.playerCreated());
      if (this.videoSrc() && this.playerCreated()) {
        console.info("start new video");
        this.player.src({ src: this.videoSrc(), type: 'video/mp4' });
        this.player.load();
        this.player.play();
      }

      if(this.target() && !this.player) {
        this.init()
      }

    });
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }

  private init() {
    if (!this.target() || this.playerCreated()) return;

    this.player = videojs(this.target()?.nativeElement, this.options);
    this.playerCreated.set(true);

    this.player.on('ended', () => {
      this.ended.emit();
    })
  }
}
