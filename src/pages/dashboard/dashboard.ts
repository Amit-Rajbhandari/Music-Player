import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, LoadingController, NavController, Platform } from 'ionic-angular';
import { Spotify } from "../../providers/spotify/spotify";
import { NativeStorage } from '@ionic-native/native-storage';
@IonicPage()

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})

export class DashboardPage {
  tracks = [];
  latestreleases = [];
  limit: string;
  playlist = [];

  constructor(
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private platform: Platform,
    private spotify: Spotify,
    private nativeStorage: NativeStorage
  ) {

  }

  ionViewWillEnter() {
    this.LatestReleases();
    this.nativeStorage.getItem('playlist')
      .then(
        data => this.playlist = JSON.parse(data),
        error => console.log(error)
      );
  }

  LatestReleases() {
    this.limit = localStorage.getItem('limit');
    let loader = this.loadingController.create({
      dismissOnPageChange: true
    })
    loader.present();
    this.spotify.getLatestReleases()
      .subscribe(
        (res: any) => {
          loader.dismiss();
          this.latestreleases = res;
          console.log(res);
        },
        (err) => {
          loader.dismiss();
          alert(err);
        });
  }

  search(query) {
    this.limit = localStorage.getItem('limit');
    let loader = this.loadingController.create({
      dismissOnPageChange: true
    })
    loader.present();
    this.spotify.searchTracks(query, this.limit)
      .subscribe(
        (res: any) => {
          this.tracks = res.tracks.items;
          loader.dismiss();
          console.log(this.tracks);
        },
        (err) => {
          loader.dismiss();
          alert(err);
        });
  }

  addToPlaylist(track) {
    let foundTrack: any = this.playlist.find(item => item.id === track.id);
    if (foundTrack) {
      console.log(`Track '${foundTrack.name}' is present in playlist`);
    } else {
      this.playlist.push(track);
      this.nativeStorage.setItem('playlist', JSON.stringify(this.playlist))
        .then(
          () => console.log('Stored item!'),
          error => console.error('Error storing item', error)
        );
      console.log(`Track '${track.name}' was added successfully`);
    }
  }

}
