import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserdataService {
  


  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  private baseURL = environment.baseURL
  private registerURL = `${this.baseURL}/register`;
  private loginURL = `${this.baseURL}/login`
  private logoutURL = `${this.baseURL}/logout`
  private userDataURL = `${this.baseURL}/user`
  private forgotPasswordURL = `${this.baseURL}/forgotPassword`
  private resetPasswordBaseURL = `${this.baseURL}/reset-password`
  private updateLastLoginDateURL = `${this.baseURL}/lastLoginUpdate`
  private updatePasswordURL = `${this.baseURL}/resetPassword`
  private submitScoreBoardURL = `${this.baseURL}/scoreboard`
  private getLeaderBoardURL = `${this.baseURL}/leaderBoard`
  private autoLogout = 86400000
  // private autoLogout= 5000 



  forgotPassword(user) {
    return this.http.post<any>(this.forgotPasswordURL, user, {
      withCredentials: true
    })
  }

  resetPasswordGet(username: string, token: string) {
    const resetPasswordURL = `${this.resetPasswordBaseURL}/${username}/${token}`;
    return this.http.get(resetPasswordURL, {
      withCredentials: true
    })
  }

  registerUser(user) {
    return this.http.post<any>(this.registerURL, user, {
      withCredentials: true
    })
  }

  submitScoreBoardUser(user) {
    return this.http.post<any>(this.submitScoreBoardURL, user, {
      withCredentials: true
    })
  }

  getLeaderBoard() {
    return this.http.get<any>(this.getLeaderBoardURL, {
      withCredentials: true
    })
  }

  loginUser(user) {
    return this.http.post<any>(this.loginURL, user, {
      withCredentials: true
    })
  }

  logoutUser() {
    localStorage.removeItem('token')
    return this.http.post<any>(this.logoutURL, {}, {
      withCredentials: true
    })
  }

  autoLogOut(expirationDate: number) {
    setTimeout(() => {
      this.logoutUser();
      this.router.navigate(['/login'])
      localStorage.removeItem('token')
      swal.fire({
        title: "Logged out",
        text: "Auto-logout feature activates following 24 hours of app usage.",
        icon: "info",
        timerProgressBar: true, // Show progress bar
        showConfirmButton: false // Hide the "OK" button
      });
    }, expirationDate)

  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }


  users() {
    this.autoLogOut(this.autoLogout)
    return this.http.get(this.userDataURL, {
      withCredentials: true
    })
  }


  updateLastLogin(user) {
    return this.http.put<any>(this.updateLastLoginDateURL, user, {
    })
  }

  updatePassword(user) {
    return this.http.put<any>(this.updatePasswordURL, user, {
    })
  }

  getJSONData() {
    return this.http.get('assets/DialingCodeCountry.json');
  }

}
