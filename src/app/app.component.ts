import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { HomePage,DashboardPage } from '../pages/pages';

@Component({
  templateUrl: 'app.html'
})
export class Music {
  @ViewChild(Nav) nav: Nav;

  rootPage = HomePage;
  drawerOptions: any;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private backgroundMode: BackgroundMode,
    private androidPermissions: AndroidPermissions,
    private diagnostic: Diagnostic, public push: Push) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('007db8');
      this.splashScreen.hide();
      this.backgroundMode.enable();
      this.pushsetup();
    });
  }

  getPermission() {
    this.diagnostic.requestExternalStorageAuthorization().then(() => {
      //User gave permission
    }).catch(error => {
      //Handle error
    });
  }

  pushsetup() {
    const options: PushOptions = {
      android: {},
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      // when app is active
      if (notification.additionalData.foreground) {

      }
      // when app is closed.
      else if (notification.additionalData.coldstart) {

      }
      // when app is minimised.
      else {
      }
    });

    pushObject.on('registration').subscribe((registration: any) => {
      //do whatever you want with the registration ID   
      if (registration && registration.registrationId)
        localStorage.setItem('push-token', registration.registrationId);
      else
        localStorage.removeItem('push-token');
    });

    pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
  }


  openPage(page: string) {
    
    if (page == 'dashboard') {
      this.nav.push(DashboardPage);
    }
    
  }

}
