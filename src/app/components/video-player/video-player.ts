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
    videoType = input<string>();
  maxDuration = input<number>();
  videoId = input<string>();

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
  private currentVideoId?: string; // tracks actual src set on player
  private maxDurationTimer?: ReturnType<typeof setTimeout>;
  private endedEmitted = false; // avoid double-emitting

  constructor() {
    effect(() => {
      const src = this.videoSrc();
      const videoId = this.videoId();
      const created = this.playerCreated();

      if (!created && this.target()) {
        this.init();
      }

      if (this.player && src && videoId) {
        this.loadNewSource(src, videoId, this.videoType(), this.maxDuration());
      }
    });

    effect(() => {
      // Whenever maxDuration input changes, reset timer with the current value
      const maxDuration = this.maxDuration();

      if (this.player && this.currentVideoId) {
        this.resetMaxDurationTimer(maxDuration);
      }
    });
  }


  ngOnDestroy(): void {
    this.clearMaxDurationTimer();

    if (this.player) {
      this.player.dispose();
      this.player = undefined;
      this.playerCreated.set(false);
    }
  }

  private init() {
    if (!this.target() || this.playerCreated()) return;

    this.player = videojs(this.target()?.nativeElement, this.options);
    this.player.muted(true); // ensuring it is muted.
    this.playerCreated.set(true);

    this.player.on('ended', () => {
      this.clearMaxDurationTimer();

      if (!this.endedEmitted) {
        this.endedEmitted = true;
        this.ended.emit();
      }
    })
  }

  private loadNewSource(src: string, videoId?: string, type?: string, maxDurationSeconds?: number) {
    if (!this.player) return;

    this.endedEmitted = false;
    this.clearMaxDurationTimer();
    this.player.reset();
    this.currentVideoId = videoId;

    // set src and load
    this.player.src({ src, type: type?? 'video/mp4' });
    this.player.load();
    this.player.muted(true);

    this.player.play();

    // set max duration if provided (>0)
    this.resetMaxDurationTimer(maxDurationSeconds);
  }

  private resetMaxDurationTimer(maxDurationSeconds?: number) {
    this.clearMaxDurationTimer();

    const maxDuration = maxDurationSeconds ?? 0;
    if (maxDuration > 0) {
      // Ensure we don't double-emit ended
      this.maxDurationTimer = setTimeout(() => {
        // stop playback and emit ended
        this.player?.pause();

        if (!this.endedEmitted) {
          this.endedEmitted = true;
          this.ended.emit();
        }
      }, maxDuration * 1000);
    }
  }

  private clearMaxDurationTimer() {
    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = undefined;
    }
  }
}
