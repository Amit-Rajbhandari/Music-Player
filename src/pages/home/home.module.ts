import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { MusicDrawerPage } from "../shared/music-drawer/music-drawer";
import { ScrollHideDirective } from "../../directives/hide-header/hide-header";

@NgModule({
  declarations: [
    HomePage,
    MusicDrawerPage,
    ScrollHideDirective
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  exports: [
    HomePage
  ],
  schemas: [ NO_ERRORS_SCHEMA ] 
})
export class HomePageModule { }

