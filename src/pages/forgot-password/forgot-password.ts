import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

@Component({
    selector: 'page-forgot-password',
    templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
    constructor(private navCtrl: NavController) { }

    goToSignin() {
        this.navCtrl.popToRoot();
    }
}