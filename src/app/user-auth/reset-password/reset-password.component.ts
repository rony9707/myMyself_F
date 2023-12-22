import { Component, OnInit } from '@angular/core';
import { UserdataService } from 'src/app/services/userdata.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { delay } from 'rxjs/operators';



@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private userData: UserdataService,
    private route: ActivatedRoute,
    private route1: Router,
    private location: Location,
    private titleService: Title
  ) {
    // console.log('Reset password Component Loaded');
  }

  username: any
  token: any
  public usernameID;
  public tokenID;
  public tokenEXP;



  // token_reset_pass: any = localStorage.getItem('token_reset_pass')
  // username_reset_pass: any = localStorage.getItem('username_reset_pass')

  ngOnInit(): void {

    //change title of a page
    this.titleService.setTitle('Reset your password');

    let usernameIDParam = this.route.snapshot.paramMap.get('username');
    this.usernameID = usernameIDParam


    let tokenIDParam = this.route.snapshot.paramMap.get('token');
    this.tokenID = tokenIDParam
    // console.log(this.usernameID)
    // console.log(this.token_reset_pass)
    // Get data from backend and show in frontend
    this.userData.resetPasswordGet(this.usernameID, this.tokenID).subscribe((data: any) => {

      if (data.message == "TokenExpiredError") {

        swal.fire({
          title: "Token Expired",
          text: "Token has expired",
          icon: "info",
          timerProgressBar: true, // Show progress bar
          showConfirmButton: false // Hide the "OK" button
        });
        this.route1.navigate([''])
      }

      if (data.message == "JsonWebTokenError") {
        this.route1.navigate(['**'])
      }




      this.tokenEXP = data.message
      this.username = `${data.response.username}`
      this.token = `${data.response.token}`


      //If Link is changed, then 404 route will be called
      if (this.usernameID != this.username || this.tokenID != this.token) {

        this.route1.navigate(['**'])
      }
      else {
        swal.fire({
          title: "Success",
          text: "Your one time link to reset your password has activated",
          icon: "info",
          timerProgressBar: true, // Show progress bar
          showConfirmButton: false // Hide the "OK" button
        });

      }

    },
      () => {
      }
    )
  }

  toolTip = "Password must be between 8 to 16 characters, must have at least one lowercase character, one uppercase character, one number and one special character."


  //Form Code
  //FormGroup and FormControl Validators Code
  resetPasswordForm = new FormGroup({
    password: new FormControl(
      '', [Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&.])[A-Za-z\d$@$!%*?&.].{8,16}')]),
    confirmPassword: new FormControl('', [Validators.required]),
    showPassword: new FormControl('')
  })

  resetPassworUser() {
    const dataToSend = {
      username: this.username,
      password: this.resetPasswordForm.value.password
    }

    if (!this.resetPasswordForm.valid) {
      swal.fire({
        title: "Validation Error",
        text: "Please ensure all mandatory fields are correctly filled out.",
        icon: "info",
        showConfirmButton: true // Display the confirmation button
      });
    }
    else {
      //If form is valid, then code here
      this.userData.updatePassword(dataToSend)
        .pipe(
          delay(1000) // Delay for 1 seconds
        )
        .subscribe((res) => {
          swal.fire({
            title: "Success",
            text: "Your password has been successfully updated. Please check your mail for confirmation.",
            icon: "success",
            timer: 3000, // Auto close after 2 seconds
            timerProgressBar: true, // Show progress bar
            showConfirmButton: false // Hide the "OK" button
          });
          localStorage.removeItem('token_reset_pass')
          localStorage.removeItem('username_reset_pass')

          this.userData.logoutUser()
            .subscribe(() => {
            })

          this.route1.navigate(['/login'])
        },
          (err) => {
            swal.fire("Error", err.error.message)
          })
    }
  }


  noButton() {
    this.resetPasswordForm.reset()
  }

  get mainPasswordValidator() {
    return this.resetPasswordForm.get('password')
  }

  get PasswordFieldValidator() {
    return this.resetPasswordForm.get('confirmPassword')
  }


  //Check password and confirm password compare
  checkPassword(evt: string): void {
    let mainPassword: string = this.resetPasswordForm.value.password
    let confirmPassword: string = evt
    if (mainPassword === confirmPassword) {
      document.getElementById("confirmPasswordTextID")?.classList.add('confirmPasswordTextDisplayCSS')
    }
    else {
      document.getElementById("confirmPasswordTextID")?.classList.remove('confirmPasswordTextDisplayCSS')
    }
    // console.log(confirmPassword)
  }

  //password field click
  passwordfield(): void {
    let mainPassword: any = document.getElementById("mainPasswordID")?.getAttribute('type')
    let confirmPassword: any = document.getElementById("confirmPasswordID")?.getAttribute('type')
    if (mainPassword === 'text' && confirmPassword === 'text' && this.resetPasswordForm.value.showPassword == true) {
      document.getElementById("mainPasswordID")?.setAttribute('type', 'password')
      document.getElementById("confirmPasswordID")?.setAttribute('type', 'password')
    }
    else if (mainPassword === 'password' && confirmPassword === 'password' && this.resetPasswordForm.value.showPassword == false) {
      document.getElementById("mainPasswordID")?.setAttribute('type', 'text')
      document.getElementById("confirmPasswordID")?.setAttribute('type', 'text')
    }
  }

}
