import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { HttpModule, Http } from '@angular/http';

import { NativeStorage } from '@ionic-native/native-storage';
import { IonicStorageModule } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Media, MediaObject } from '@ionic-native/media';
import { MusicControls } from '@ionic-native/music-controls';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from '@ionic-native/push';
import { Music } from './app.component';
import { Spotify } from '../providers/providers';

@NgModule({
  declarations: [
    Music
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(Music),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Music
  ],
  providers: [
    Spotify,
    StatusBar,
    SplashScreen,
    NativeStorage,
    BackgroundMode,
    AndroidPermissions,
    Diagnostic,
    File,
    FilePath,
    FileTransfer,
    FileTransferObject ,
    Media,
    Push,
    MusicControls,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  schemas:      [ NO_ERRORS_SCHEMA ] // add this line
})
export class AppModule {}
