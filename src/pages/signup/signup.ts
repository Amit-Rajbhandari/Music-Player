import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignupPage {
    constructor(private navCtrl: NavController) { }

    goToSignin() {
        this.navCtrl.popToRoot();
    }
}