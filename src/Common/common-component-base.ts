import { LoadingController, NavController, Loading } from "ionic-angular";
import { Injectable } from "@angular/core";

@Injectable()
export abstract class CommonComponentBase {
    public defaultLoading : Loading;
    constructor(
        public loadingCtrl: LoadingController,
        public navCtr: NavController,
    ) {} 

    initLoading(): Loading {

        this.defaultLoading = this.loadingCtrl.create({
            spinner: "bubbles",
            content: "Loading...",
            dismissOnPageChange: false
        });
        return this.defaultLoading; 
    } 

    abstract get(): void;
    
      
}