import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlbumPage } from './album';
import { MusicDrawerPage } from "../shared/music-drawer/music-drawer";

@NgModule({
  declarations: [
    AlbumPage,
    MusicDrawerPage
  ],
  imports: [
    IonicPageModule.forChild(AlbumPage),
  ],
  exports: [
    AlbumPage
  ],
  schemas: [ NO_ERRORS_SCHEMA ] 
})
export class AlbumPageModule { }

