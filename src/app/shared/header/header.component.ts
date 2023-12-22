import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserdataService } from 'src/app/services/userdata.service';
import swal from 'sweetalert2';

@Component({
  selector: 'appheader',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private userData: UserdataService,
    private router: Router
  ) {
    // console.log('Header Component Loaded');
  }

  ngOnInit(): void {
  }

  //Navigates to the user welcome page or the login page as fit
  goToUserProfile() {
    this.userData.users().subscribe((data: any) => {
      var username = `${data.username}`
      this.router.navigate(['/user', username])
    },
      (err) => {
        this.router.navigate(['/login'])
        swal.fire({
          title: "Not Logged in",
          text: "Login required for application access",
          icon: "info",
          timer: 2000, // Auto close after 2 seconds
          timerProgressBar: true, // Show progress bar
          showConfirmButton: false // Hide the "OK" button
        });
      }
    )

  }

}
