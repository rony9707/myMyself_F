import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutMeComponent } from './home/about-me/about-me.component';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './user-auth/login/login.component';
import { RegisterComponent } from './user-auth/register/register.component';
import { UserWelcomeComponent } from './user/user-welcome/user-welcome.component';
import { AuthGuard } from './user-auth/auth.guard';
import { Error404Component } from './shared/error404/error404.component';
import { ResetPasswordComponent } from './user-auth/reset-password/reset-password.component';
import { UnderConstructionComponent } from './shared/under-construction/under-construction.component';

const routes: Routes = [
  {
    component: HomeComponent,
    path: ''
  },
  {
    component: LoginComponent,
    path: 'login'
  },
  {
    component: RegisterComponent,
    path: 'register'
  },
  {
    component: AboutMeComponent,
    path: 'mySelf'
  },
  {
    component: UserWelcomeComponent,
    canActivate: [AuthGuard],  //Currently AuthGuard is not working for the UserWelcome Component. It is handled in the 
    path: 'user/:usernameID'
  },
  {
    component: ResetPasswordComponent,
    path: 'reset-password/:username/:token'
  },
  {
    component: UnderConstructionComponent,
    path: 'underConstruction'
  },
  {
    component: Error404Component,
    path: '**'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],  /*angular scrool to top during route without animation */
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
