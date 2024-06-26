import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserWelcomeComponent } from './user-welcome/user-welcome.component';
import { SharedModule } from '../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';



@NgModule({
  declarations: [
    UserWelcomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AgGridModule
  ]
})
export class UserModule {
  constructor(){
    // console.log('User Module Loaded');
  }

}
