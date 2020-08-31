import { Component, Input, ElementRef, Renderer } from '@angular/core';
import { Platform, DomController } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { MusicControls } from '@ionic-native/music-controls';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import * as jsmediatags from 'jsmediatags';
@Component({
  selector: 'music-drawer',
  templateUrl: 'music-drawer.html'
})
export class MusicDrawerPage {

  @Input() tracks = [];
  @Input() options: any;

  handleHeight: number = 64;
  bounceBack: boolean = true;
  thresholdTop: number = this.platform.height() / 2;
  thresholdBottom: number = this.platform.height() / 2;

  playingMedia = false;
  trackMeta = {};
  isShuffle = false;
  isPause = false;
  progressInterval: any;
  duration: any = -1;
  get_duration_interval: any;
  get_position_interval: any;
  totalDuration: any;
  position = 0;
  myMusic = { media: null, index: 0, song: '' };

  constructor(public element: ElementRef,
    public renderer: Renderer,
    private domSanitizer: DomSanitizer,
    public domCtrl: DomController,
    public platform: Platform,
    private media: Media,
    private musicControls: MusicControls) {
  }

  ngAfterViewInit() {

    if (this.options.handleHeight) {
      this.handleHeight = this.options.handleHeight;
    }

    if (this.options.bounceBack) {
      this.bounceBack = this.options.bounceBack;
    }

    if (this.options.thresholdFromBottom) {
      this.thresholdBottom = this.options.thresholdFromBottom;
    }

    if (this.options.thresholdFromTop) {
      this.thresholdTop = this.options.thresholdFromTop;
    }

    this.renderer.setElementStyle(this.element.nativeElement, 'top', this.platform.height() - this.handleHeight + 'px');
    this.renderer.setElementStyle(this.element.nativeElement, 'padding-top', this.handleHeight + 'px');

    let hammer = new window['Hammer'](this.element.nativeElement);
    hammer.get('pan').set({ direction: window['Hammer'].DIRECTION_VERTICAL });

    hammer.on('pan', (ev) => {
      this.handlePan(ev);
    });

  }

  handlePan(ev) {

    let newTop = ev.center.y;

    let bounceToBottom = false;
    let bounceToTop = false;

    if (this.bounceBack && ev.isFinal) {

      let topDiff = newTop - this.thresholdTop;
      let bottomDiff = (this.platform.height() - this.thresholdBottom) - newTop;

      topDiff >= bottomDiff ? bounceToBottom = true : bounceToTop = true;

    }

    if ((newTop < this.thresholdTop && ev.additionalEvent === "panup") || bounceToTop) {

      this.domCtrl.write(() => {
        this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'top 0.5s');
        this.renderer.setElementStyle(this.element.nativeElement, 'top', '0px');
        this.renderer.setElementAttribute(this.element.nativeElement, 'class', 'open')
      });

    } else if (((this.platform.height() - newTop) < this.thresholdBottom && ev.additionalEvent === "pandown") || bounceToBottom) {

      this.domCtrl.write(() => {
        this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'top 0.5s');
        this.renderer.setElementStyle(this.element.nativeElement, 'top', this.platform.height() - this.handleHeight + 'px');
        this.renderer.setElementAttribute(this.element.nativeElement, 'class', ' ')
      });

    } else {

      this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'none');

      if (newTop > 0 && newTop < (this.platform.height() - this.handleHeight)) {

        if (ev.additionalEvent === "panup" || ev.additionalEvent === "pandown") {

          this.domCtrl.write(() => {
            this.renderer.setElementStyle(this.element.nativeElement, 'top', newTop + 'px');
          });

        }

      }

    }

  }

  getAndSetCurrentAudioPosition() {
    let diff = 1;
    let self = this;
    this.get_position_interval = setInterval(function () {
      let last_position = self.position;
      let currentPl = self.myMusic.media;
      currentPl.getCurrentPosition().then((currposition) => {
        if (currposition >= 0 && currposition < self.duration) {
          if (Math.abs(last_position - currposition) >= diff) {
            // set position
            currentPl.seekTo(last_position * 1000);
          } else {
            // update position for display
            self.position = currposition;
          }

        } else if (currposition >= self.duration) {
          clearInterval(self.get_position_interval);
          self.next();
        }
      });
    }, 100);
  }

  // get currently playing track duration
  getDurationAndSetToPlay() {
    let currentPl = this.myMusic.media;
    let self = this;
    this.get_duration_interval = setInterval(function () {
      if (self.duration == -1) {
        self.duration = ~~(currentPl.getDuration());  // make it an integer
      } else {
        clearInterval(self.get_duration_interval);
        let minutes = Math.floor(self.duration / 60);
        let seconds = self.duration - minutes * 60;
        let finalTime = self.str_pad_left(minutes, '0', 2) + ':' + self.str_pad_left(seconds, '0', 2);
        self.totalDuration = finalTime;
        console.log(self.duration);
      }
    }, 100);
  }

  playMedia(item, i) {
    let mp3 = item.songPath;
    let music: MediaObject = this.media.create(mp3);
    let that = this;

    // reset range position and duration
    if (this.get_position_interval) {
      clearInterval(this.get_position_interval);
    }
    if (this.get_duration_interval) {
      clearInterval(this.get_duration_interval);
    }

    // reset seek position after song is changed
    this.position = 0;
    this.duration = -1;

    if (this.myMusic.media != null) {
      this.tracks[this.myMusic.index].playing = false;
      this.myMusic.media.stop();
      this.myMusic.media.release();
    }

    this.myMusic.media = music;
    this.myMusic.index = i;

    music.play();
    item.playing = true;

    this.albumArt(item, i);
  }

  play(item, i) {
    this.playingMedia = true;
    this.playMedia(item, i);
    this.getDurationAndSetToPlay();
    this.getAndSetCurrentAudioPosition();
  }

  pause() {
    if (this.myMusic.media != null) {
      this.playingMedia = false;
      this.isPause = true;
      this.myMusic.media.pause();
    }
  }

  // conveting track duration to readable format
  str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  next() {
    if (this.myMusic.media != null) {
      let currentTrackIndex = this.myMusic.index;
      let nextTrackIndex = currentTrackIndex > this.tracks.length ? this.tracks.length : currentTrackIndex + 1;
      let nextTrack = this.tracks[nextTrackIndex];
      console.log(nextTrack);
      this.playMedia(nextTrack, nextTrackIndex);
      this.getDurationAndSetToPlay();
      this.getAndSetCurrentAudioPosition();
      nextTrack.playing = true;
    }
  }

  prev() {
    if (this.myMusic.media != null) {
      let currentTrackIndex = this.myMusic.index;
      let prevTrackIndex = currentTrackIndex < 0 ? 0 : currentTrackIndex - 1;
      let prevtTrack = this.tracks[prevTrackIndex];
      console.log(prevtTrack);
      this.playMedia(prevtTrack, prevTrackIndex);
      this.getDurationAndSetToPlay();
      this.getAndSetCurrentAudioPosition();
      prevtTrack.playing = true;
    }
  }

  resume() {
    if (this.myMusic.media != null) {
      this.playingMedia = true;
      this.isPause = false;
      this.myMusic.media.play();
    }
  }

  shuffle() {
    let shuffled = [];
    let len = this.tracks.length;
    if (this.isShuffle) {
      //unshuffle if shuffled
      this.isShuffle = false;
      let currentTrack = this.tracks[this.myMusic.index].songName;
      //this.tracks order by default
      this.sortMusic();
      let newIndexForCurrentTrack = this.getSongIndexBySongName(currentTrack);
      this.myMusic.index = newIndexForCurrentTrack;
    } else {
      if (this.myMusic.media != null && this.myMusic.index > 0) {
        let currentTrack = this.tracks[this.myMusic.index];
        len = this.myMusic.index == 0 ? len : len - 1;
        shuffled.push(currentTrack);
        this.tracks.splice(this.myMusic.index, 1);
        this.myMusic.index = 0;
      }
      for (let i = 0; i < len; i++) {
        let randomIndex = this.randomNoGenrater(0, this.tracks.length)
        if (this.tracks[randomIndex]) {
          shuffled.push(this.tracks[randomIndex])
          this.tracks.splice(randomIndex, 1)
        }
      }
      this.tracks = shuffled;
      // this.isShuffle = true;
      // if (this.playingMedia == false) {
      //   this.play(shuffled[0], 0);
      // }
      console.log(this.tracks)
    }  
  }

  // Sort Music Alphabetically
  sortMusic() {
    return this.tracks.sort((a, b) => a.songName.toLowerCase() !== b.songName.toLowerCase() ? a.songName.toLowerCase() < b.songName.toLowerCase() ? -1 : 1 : 0);
  }

  // Shuffle random index Random Genrater
  randomNoGenrater(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  getSongIndexBySongName(name) {
    let _i = 0;
    let a = this.tracks.filter(function (item, index) {
      if (item.songName == name) {
        _i = index
        //return item
      }
    })
    return _i;
  }

  albumArt(playingTrack, i) {
    let that = this;
    new jsmediatags.Reader(playingTrack.songinfoPath)
      .setTagsToRead(['title', 'artist', 'picture'])
      .read({
        onSuccess: function (tag) {
          that.trackMeta = {
            title: tag.tags.title ? tag.tags.title : playingTrack.songName,
            artist: tag.tags.artist ? tag.tags.artist : 'Unknown artist',
            cover: tag.tags.picture ? that.convertToBase64(tag.tags.picture) : 'assets/images/main-logo.svg',
            bgCover: tag.tags.picture ? that.domSanitizer.bypassSecurityTrustStyle("url('" + that.convertToBase64(tag.tags.picture) + "')") : that.domSanitizer.bypassSecurityTrustStyle("url('assets/images/main-logo.svg')")
          }
        },
        onError: function (error) {
          if (error.type === "xhr") {
            console.log("There was a network error: ", error.xhr);
          }
          that.trackMeta = {
            title: playingTrack.songName,
            artist: 'Unknown artist',
            cover: 'assets/images/main-logo.svg',
            bgCover: that.domSanitizer.bypassSecurityTrustStyle("url('assets/images/main-logo.svg')")
          }
          // that.defaultTrackName = playingTrack.songName;
        }
      });
  }

  // Convert cover image to base64
  convertToBase64(arr) {
    let base64String = "";
    for (let i = 0; i < arr.data.length; i++) {
      base64String += String.fromCharCode(arr.data[i]);
    }
    return "data:image/jpeg;base64," + window.btoa(base64String);
  }

  /*** utility functions ***/

  // this is replaced by the angular DatePipe:
  // https://angular.io/api/common/DatePipe
  fmtMSS(s) {   // accepts seconds as Number or String. Returns m:ss
    return (s -         // take value s and subtract (will try to convert String to Number)
      (s %= 60) // the new value of s, now holding the remainder of s divided by 60 
      // (will also try to convert String to Number)
    ) / 60 + (    // and divide the resulting Number by 60 
        // (can never result in a fractional value = no need for rounding)
        // to which we concatenate a String (converts the Number to String)
        // who's reference is chosen by the conditional operator:
        9 < s       // if    seconds is larger than 9
          ? ':'       // then  we don't need to prepend a zero
          : ':0'      // else  we do need to prepend a zero
      ) + s;       // and we add Number s to the string (converting it to String as well)
  }

}