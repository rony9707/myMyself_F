import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserdataService } from 'src/app/services/userdata.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private datePipe: DatePipe,
    private http: HttpClient,
    private router: Router,
    private userData: UserdataService,
    private sanitizer: DomSanitizer
  ) {
    // console.log('Register Component Loaded');
  }

  jsonData: any;
  ngOnInit(): void {

    this.userData.getJSONData().subscribe((data) => {
      this.jsonData = data;
      // You can now use this.jsonData in your component.
    });
  }

  toolTip = "The password requirement necessitates a length spanning between 8 to 16 characters, with mandatory inclusion of at least one lowercase letter, one uppercase letter, one numerical digit, and one special character."

  //Form Code
  //FormGroup and FormControl Validators Code
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl(
      '', [Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&.])[A-Za-z\d$@$!%*?&.].{8,16}')]),
    confirmPassword: new FormControl('', [Validators.required]),
    showPassword: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required]),
    phoneNumberCode: new FormControl('+91', [Validators.required]),
    gender: new FormControl(''), //Checked Male in html
    dob: new FormControl('', [Validators.required]),
    uploadImage: new FormControl('', [Validators.required])
  })

  //-------------------Handles Image Crop Start----------------------------------------------------------------

  defaultImageUrl: string = 'assets/images/avatar.png'; // Replace with your default image URL
  selectedFile; //data sent to backend

  imgChangeEvt: any = '';
  cropImagePreview: any = '';
  showCropper: boolean = false;

  changeonImage(event: any) {
    this.imgChangeEvt = event;
    this.showCropper = true;
  }

  cropImg(event: ImageCroppedEvent) {
    const sanitizedUrl = event.objectUrl || '';

    // Create a new Image element to load the cropped image
    const img = new Image();
    img.src = sanitizedUrl;

    img.onload = () => {
      // Create a canvas element to draw the image
      const canvas = document.createElement('canvas');
      const ctx: any = canvas.getContext('2d');

      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Convert the canvas content to a data URL with JPG format
      const jpgDataUrl = canvas.toDataURL('image/jpeg');

      // Sanitize and assign the JPG data URL to your cropImagePreview variable
      this.cropImagePreview = this.sanitizer.bypassSecurityTrustUrl(jpgDataUrl);
      // console.log(this.cropImagePreview.changingThisBreaksApplicationSecurity)
      this.selectedFile = this.cropImagePreview.changingThisBreaksApplicationSecurity
    };
  }

  imgLoad() {

  }

  initCropper() {

  }

  imgFailed() {

  }

  closeCropper() {
    this.imgChangeEvt = '';
    this.showCropper = false;
  }

  //-------------------Handles Image Crop End----------------------------------------------------------------

  //Age Object
  ageObj = {
    age: ""
  }

  date = new Date();//For age calculation

  //Register Butoon Code
  registerUser() {
    //PhoneNumer Code and Phone NUmber Merge
    let fullPhoneNumber = this.registerForm.value.phoneNumberCode + this.registerForm.value.phoneNumber

    //Get age of user from date of birth code start
    let currentYear: any = this.datePipe.transform(this.date, "yyyy");
    let userYear: any = this.datePipe.transform(this.registerForm.value.dob, "yyyy");

    let currentMM: any = this.datePipe.transform(this.date, "MM");
    let userMM: any = this.datePipe.transform(this.registerForm.value.dob, "MM");

    let currentDD: any = this.datePipe.transform(this.date, "dd");
    let userDD: any = this.datePipe.transform(this.registerForm.value.dob, "dd");

    let currentMMDD = currentMM + currentDD;
    let userMMDD = userMM + userDD;

    this.ageObj.age = (currentYear - userYear).toString();


    if (currentMMDD > userMMDD) {
      this.ageObj.age = (parseInt(this.ageObj.age) - 1).toString()
    } else {
      this.ageObj.age = this.ageObj.age
    }
    //Get age of user from date of birth code End

    if (!this.registerForm.valid) {
      swal.fire({
        title: "Validation Error",
        text: "Please ensure all mandatory fields are correctly filled out.",
        icon: "info",
        showConfirmButton: true // Display the confirmation button
      });
    }
    else if (parseInt(this.ageObj.age) < 18) {
      swal.fire({
        title: "Age Verification",
        text: "You must be at least 18 years old to proceed.",
        icon: "info",
        showConfirmButton: true // Display the confirmation button
      });
    }
    else if (this.registerForm.valid) {
      // const formData = new FormData();
      // formData.append('image', this.selectedFile);
      // formData.append('firstName', this.registerForm.value.firstName);
      // formData.append('lastName', this.registerForm.value.lastName);
      // formData.append('username', this.registerForm.value.username);
      // formData.append('password', this.registerForm.value.password);
      // formData.append('email', this.registerForm.value.email);
      // formData.append('phoneNumber', this.phoneNumberFull.phoneNumber);
      // formData.append('gender', this.registerForm.value.gender);
      // formData.append('dob', this.registerForm.value.dob);
      // formData.append('age', this.ageObj.age);
      // console.log(formData)


      let dataSentToBack = {
        image: this.selectedFile,
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email,
        phoneNumber: fullPhoneNumber,
        dob: this.registerForm.value.dob,
        gender: this.registerForm.value.gender,
        age: this.ageObj.age
      }

      this.userData.registerUser(dataSentToBack)
        .subscribe(
          (res) => {
            this.router.navigate(['/user', dataSentToBack.username])
            swal.fire({
              title: "Registration Successful",
              text: "Your profile has been successfully created. Kindly review your email for confirmation.",
              icon: "success",
              timer: 2500, // Auto close after 2 seconds
              timerProgressBar: true, // Show progress bar
              showConfirmButton: false // Hide the "OK" button
            });
            localStorage.setItem('token', res.token)
          },
          (err) => {
            swal.fire("Error", err.error.message)
          }
        )

    }
  }

  //Code for input field validator text 
  get firstNameValidator() {
    return this.registerForm.get('firstName')
  }

  get lastNameValidator() {
    return this.registerForm.get('lastName')
  }

  get usernameValidator() {
    return this.registerForm.get('username')
  }

  get mainPasswordValidator() {
    return this.registerForm.get('password')
  }

  get PasswordFieldValidator() {
    return this.registerForm.get('confirmPassword')
  }

  get emailValidator() {
    return this.registerForm.get('email')
  }

  get phoneNumberValidator() {
    return this.registerForm.get('phoneNumber')
  }

  get dobValidator() {
    return this.registerForm.get('dob')
  }

  get uploadImageValidator() {
    return this.registerForm.get('uploadImage')
  }

  //Show password checkboc toggle
  passwordfield(): void {
    let mainPassword: any = document.getElementById("mainPasswordID")?.getAttribute('type')
    let confirmPassword: any = document.getElementById("confirmPasswordID")?.getAttribute('type')
    if (mainPassword === 'text' && confirmPassword === 'text' && this.registerForm.value.showPassword == true) {
      document.getElementById("mainPasswordID")?.setAttribute('type', 'password')
      document.getElementById("confirmPasswordID")?.setAttribute('type', 'password')
    }
    else if (mainPassword === 'password' && confirmPassword === 'password' && this.registerForm.value.showPassword == false) {
      document.getElementById("mainPasswordID")?.setAttribute('type', 'text')
      document.getElementById("confirmPasswordID")?.setAttribute('type', 'text')
    }
  }

  //Check password and confirm password compare
  checkPassword(evt: string): void {
    const mainPasswordControl: AbstractControl | null = this.registerForm.get('password');
    const confirmPasswordControl: AbstractControl | null = this.registerForm.get('confirmPassword');

    if (mainPasswordControl && confirmPasswordControl) {
      const mainPassword: string = mainPasswordControl.value;
      const confirmPassword: string = evt;

      if (mainPassword === confirmPassword) {
        confirmPasswordControl.setErrors(null); // Passwords match, clear validation error
      } else {
        confirmPasswordControl.setErrors({ mismatch: true }); // Passwords don't match, set validation error
      }
    }
  }

  //ImageClick Code
  clickImgCount = 0
  imgClick() {
    this.clickImgCount++
    if (this.clickImgCount == 5) {
      document.getElementById("Image")?.classList.add('confirmPasswordTextDisplayCSS')
      document.getElementById("Image1")?.classList.remove('imageHide')
    }
  }

  //Function which will help to type only alphabets and numbers
  onlyAlphabetsAndNumbers(event: KeyboardEvent) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode > 47 && charCode < 58)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  //Function which will help to type only alphabets
  onlyAlphabets(event: KeyboardEvent) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode == 32)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  //Function which will help to type only and numbers
  onlyNumbers(event: KeyboardEvent) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 47 && charCode < 58)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }



}
