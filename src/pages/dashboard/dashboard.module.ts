import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';

@NgModule({
  declarations: [
    DashboardPage
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
  ],
  exports: [
    DashboardPage
  ],
  schemas: [ NO_ERRORS_SCHEMA ] 
})
export class DashboardPageModule { }

