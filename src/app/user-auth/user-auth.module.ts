import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../directives/click-outside.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ClickOutsideDirective,
    ResetPasswordComponent
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTooltipModule,
    ImageCropperModule,
    RouterModule
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent
  ]
})
export class UserAuthModule {
  constructor(){
    // console.log('User Auth Module Loaded');
  }
 }
