import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserdataService } from '../services/userdata.service';
import swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private userDataService: UserdataService,
    private router: Router
  ) { }

  canActivate(): boolean {
    if (this.userDataService.loggedIn()) {
      return true
    } else {
      this.router.navigate(['/login'])

      swal.fire({
        title: "Not Logged in",
        text: "Login required for application access.",
        icon: "info",
        timer: 2000, // Auto close after 2 seconds
        timerProgressBar: true, // Show progress bar
        showConfirmButton: false // Hide the "OK" button
      });
      return false
    }
  }


}
