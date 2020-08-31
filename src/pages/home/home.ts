import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, LoadingController, NavController, Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { ScrollHideConfig } from '../../directives/hide-header/hide-header';
import { MusicDrawerPage } from "../shared/music-drawer/music-drawer";
import * as jsmediatags from 'jsmediatags';
@IonicPage()

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild(MusicDrawerPage) musicDrawerPage: MusicDrawerPage;
  headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 56 };
  scrollAlong: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: -0 };

  tracks = [];
  myList = [];
  options: any;
  tabValue = 'songs';
  playClass = false;
  currentPageClass = this;
  triggerAlphaScrollChange: number = 0;

  constructor(
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private nativeStorage: NativeStorage,
    private file: File,
    private filepath: FilePath,
    private platform: Platform,
  ) {
    this.options = {
      handleHeight: 64,
      thresholdFromBottom: this.platform.height() / 2,
      thresholdFromTop: this.platform.height() / 2,
      bounceBack: true
    };

  }

  ionViewDidEnter() {
    this.nativeStorage.getItem('songs')
      .then(
        data => this.tracks = JSON.parse(data),
        error => console.log(error)
      );
  }

  //Get all music files from device
  listFiles() {
    let loader = this.loadingController.create({
      content: 'Fetching Data...'
    })
    loader.present().then(async () => {
      await this.listDirectoryRecursively(this.file.externalRootDirectory, '', this.myList)
      let trackList = this.tracks;

      setTimeout(() => {
        this.sortMusic();
        this.nativeStorage.clear().then(() => console.log('Cleared!'), error => console.error('Error', error));
        this.nativeStorage.setItem('songs', JSON.stringify(trackList))
          .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
          );

        loader.dismiss();
      }, 10000)
    });
  }

  // Recursive function to list files from each directory of device
  listDirectoryRecursively = async (path, dirName, pathList) => {
    let result = await this.file.listDir(path, dirName);
    for (let fileList of result) {
      if (fileList.isDirectory === true) {
        //folder here
        if (fileList.name != 'Android' && !fileList.name.startsWith(".")) {
          const parentNativeURL = decodeURIComponent(fileList.nativeURL).replace(fileList.name, '');
          try {
            await this.listDirectoryRecursively(parentNativeURL, fileList.name, pathList);
          } catch (e) {
            console.log(e);
          }
        }

      } else if (fileList.isFile === true) {
        //file ends with audio extension and doesnt start with .
        let that = this;
        if (fileList.name.endsWith(".mp3") || fileList.name.endsWith(".m4b") || fileList.name.endsWith(".flac") || fileList.name.endsWith(".pcm") || fileList.name.endsWith(".ogg") || fileList.name.endsWith(".MP3") || fileList.name.endsWith(".M4B") || fileList.name.endsWith(".FLAC") || fileList.name.endsWith(".PCM") || fileList.name.endsWith(".OGG")) {
          // filter from metadata if greater than 2MB
          fileList.getMetadata(function (metadata) {
            let size = metadata.size;
            if (size > 1500000) {
              let fileName = fileList.name.split('.')[0];
              let Filepath = fileList.fullPath;
              let songinfoPath = fileList.toInternalURL();
              let songList = { songName: fileName, songPath: Filepath, songinfoPath, playing: false, trackInfo: {} };
              pathList.push(Filepath);
              that.tracks.push(songList);
            }
          })
        }
      }
    }
    return pathList;
  }

  // Sort Music Alphabetically
  sortMusic() {
    return this.tracks.sort((a, b) => a.songName.toLowerCase() !== b.songName.toLowerCase() ? a.songName.toLowerCase() < b.songName.toLowerCase() ? -1 : 1 : 0);
  }

  //Play song
  play(item, i) {
    this.playClass = true;
    this.musicDrawerPage.play(item, i);
  }

  //Pause song
  pause() {
    this.playClass = true;
    this.musicDrawerPage.pause();
  }

  shuffle() {
    this.playClass = true;
    this.musicDrawerPage.shuffle();
  }

  onItemClick(item) {
    this.triggerAlphaScrollChange++;
  }

}
