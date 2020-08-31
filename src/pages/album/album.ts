import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, LoadingController, NavController, Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { MusicDrawerPage } from "../shared/music-drawer/music-drawer";

@IonicPage()

@Component({
  selector: 'page-album',
  templateUrl: 'album.html'
})

export class AlbumPage {

  @ViewChild(MusicDrawerPage) musicDrawerPage: MusicDrawerPage;

  tracks = [];
  myList = [];
  options: any;

  constructor(
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private nativeStorage: NativeStorage,
    private file: File,
    private filepath: FilePath,
    private platform: Platform
  ) {
    this.options = {
      handleHeight: 64,
      thresholdFromBottom: this.platform.height() / 2,
      thresholdFromTop: this.platform.height() / 2,
      bounceBack: true
    };

  }

  
}
