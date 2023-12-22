import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { UserdataService } from 'src/app/services/userdata.service';
import { Title } from '@angular/platform-browser';

// var shajs: any = require('sha.js')



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None //To change font size of mattooltip
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private userData: UserdataService,
    private titleService: Title
  ) {
    // console.log('Login Component Loaded');
  }

  //This has the username of the user which will be shown in the next page
  username: any = ""


  ngOnInit() {
    this.titleService.setTitle('NRony');
  }


  //pasword Cut,Copy and Paste
  DisableCut(event: any) {
    event.preventDefault();
  }

  DisableCopy(event: any) {
    event.preventDefault();
  }

  DisablePaste(event: any) {
    event.preventDefault();
  }


  //password field click
  passwordfield(): void {
    let passwordTypeAttribute: any = document.getElementById("password-field-id")?.getAttribute('type')
    // console.log(typeof (passwordTypeAttribute))
    if (passwordTypeAttribute === 'text') {
      document.getElementById("password-field-id")?.setAttribute('type', 'password')
      document.getElementById("togglePassword")?.classList.remove('bi-eye')
      document.getElementById("togglePassword")?.classList.add('bi-eye-slash')
    }
    else {
      document.getElementById("password-field-id")?.setAttribute('type', 'text')
      document.getElementById("togglePassword")?.classList.remove('bi-eye-slash')
      document.getElementById("togglePassword")?.classList.add('bi-eye')
    }
  }

  //Form Code
  //FormGroup and FormControl Validators Code
  loginForm = new FormGroup({
    username: new FormControl(localStorage.getItem('rememberMeUsername'), [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(localStorage.getItem('rememberMeCheckbox') === 'true')//Here conversion is done from string to boolean as in local stroage stores data in string
  })

  lastLoginDateObj = {
    username: ""
  }

  disableButton = false
  //Get value of the form code
  loginUser() {
    this.disableButton = true;

    //Remember me code
    if (this.loginForm.value.rememberMe == true) {
      localStorage.setItem('rememberMeUsername', this.loginForm.value.username)
      localStorage.setItem('rememberMeCheckbox', JSON.stringify(true))
    }
    else if (this.loginForm.value.rememberMe == false) {
      localStorage.removeItem('rememberMeUsername')
      localStorage.setItem('rememberMeCheckbox', JSON.stringify(false))
    }

    if (!this.loginForm.valid) {
      swal.fire({
        title: "Error",
        text: "Please fill all required fields correctly.",
        icon: "error",
        timer: 1500, // Auto close after 2 seconds
        timerProgressBar: true, // Show progress bar
        showConfirmButton: false // Hide the "OK" button
      });
    }
    else if (this.loginForm.valid) {

      this.lastLoginDateObj.username = this.loginForm.value.username;
      //Checking login user authentication
      this.userData.loginUser(this.loginForm.value)
        .pipe(
          delay(1000) // Delay for 2 seconds
        )
        .subscribe((res) => {
          this.disableButton = false;
          swal.fire({
            title: "Success",
            text: "You are logged in successfully",
            icon: "success",
            timer: 1500, // Auto close after 2 seconds
            timerProgressBar: true, // Show progress bar
            showConfirmButton: false // Hide the "OK" button
          });
          localStorage.setItem('token', res.token)



          //Update LastLoginDate time of the user
          this.userData.updateLastLogin(this.lastLoginDateObj)
            .subscribe((res) => {
            },
              (err) => {
                swal.fire("Error", err.error.message)
              })


          // To show username in the URL next page
          this.userData.users().subscribe((data: any) => {
            this.username = `${data.username}`
            this.router.navigate(['/user', this.username])
          },
            (err) => {
            }
          )


        },
          (err) => {
            swal.fire("Error", err.error.message)
            this.disableButton = false;
          })

    }
  }




  //Code for input field validator text 
  get usernameValidator() {
    return this.loginForm.get('username')
  }

  get passwordValidator() {
    return this.loginForm.get('password')
  }



  //Code for popup modal
  ispopUpShow: boolean = false

  clickHandler() {
    this.ispopUpShow = true;
    document.getElementById("blur")?.classList.add('blur');
  }

  closePop() {
    this.ispopUpShow = false;
    document.getElementById("blur")?.classList.remove('blur')
  }


  //Code for closing modal by clicking outside of the modal
  ClickedOut(event) {
    if (event.target.className === "hover_bkgr_fricc" || event.target.className === "hover_bkgr_fricc ng-star-inserted") {
      this.ispopUpShow = false;
      document.getElementById("blur")?.classList.remove('blur')
    }
  }


  //Forget Password Form
  forgetPassword = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })


  //Forget Password button click code
  forgetPasswordEmail() {

    this.userData.forgotPassword(this.forgetPassword.value)
      .pipe(
        delay(1000) // Delay for 2 seconds
      )
      .subscribe((res) => {
        swal.fire({
          title: "Success",
          text: "A link to reset your password has been sent to your email successfully.",
          icon: "success",
          timer: 1500, // Auto close after 2 seconds
          timerProgressBar: true, // Show progress bar
          showConfirmButton: false // Hide the "OK" button
        });
        // localStorage.setItem('token_reset_pass', res.token)
        // localStorage.setItem('username_reset_pass', res.username)
      },
        (err) => {
          swal.fire({
            title: "Error",
            text: err.error.message,
            icon: "error",
          })
        })

  }

  //Code for input field validator text 
  get forgetPassEmailValidator() {
    return this.forgetPassword.get('email')
  }


  //Function which will help to not type space in email field
  doNotLetTypeSpace(event: KeyboardEvent) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode != 32)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }




}
