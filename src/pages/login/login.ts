import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { LoadedModule } from 'ionic-angular/util/module-loader';
import { SignupPage, ForgotPasswordPage } from "../pages";
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    constructor(
        private navCtrl: NavController,
        private loadingController: LoadingController
    ) { }

    signUp() {
        let loader = this.loadingController.create({
            dismissOnPageChange: true
        })
        loader.present();
        this.navCtrl.push(SignupPage);
    }
    forgotPass() {
        this.navCtrl.push(ForgotPasswordPage);
    }
}