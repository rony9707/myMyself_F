import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { UserdataService } from 'src/app/services/userdata.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-user-welcome',
  templateUrl: './user-welcome.component.html',
  styleUrls: ['./user-welcome.component.css']
})
export class UserWelcomeComponent implements OnInit {

  username: any;
  firstname: any;
  lastname: any;
  imageUrl: string | ArrayBuffer | null = null;
  email: any
  age: any
  LastLogin: any
  dob: any
  date = new Date();


  constructor(
    private userData: UserdataService,
    private route: ActivatedRoute,
    private route1: Router,
    private location: Location,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    // console.log('Welcome User Module Loaded');

  }


  public usernameID;


  ngOnInit(): void {

    // Get data from backend and show in frontend
    this.userData.users().subscribe(
      (data: any) => {
        this.username = data.username;
        this.firstname = data.firstName;
        this.lastname = data.lastName;
        this.imageUrl = data.profilePic;
        this.email = data.email;
        this.dob = data.dob;

        //To make the profile button active if the profile route is active
        if (this.route1.isActive(`/user/${this.username}`, true) == true) {
          document.getElementById('profile')?.classList.add('current-page')
        };

        let currentYear: any = this.datePipe.transform(this.date, "yyyy");
        let userYear: any = this.datePipe.transform(this.dob, "yyyy");

        let currentMM: any = this.datePipe.transform(this.date, "MM");
        let userMM: any = this.datePipe.transform(this.dob, "MM");

        let currentDD: any = this.datePipe.transform(this.date, "dd");
        let userDD: any = this.datePipe.transform(this.dob, "dd");

        let currentMMDD = currentMM + currentDD;
        let userMMDD = userMM + userDD;

        this.age = (currentYear - userYear).toString();

        if (currentMMDD > userMMDD) {
          this.age = (parseInt(this.age) - 1).toString()
        } else {
          this.age
        }
        const dteLastLoginF = data.dteLastLogin.replace(' at ', ', ')
        const date = new Date(dteLastLoginF);
        const formattedDate = this.formatDate(date);
        setTimeout(() => {
          this.LastLogin = formattedDate;
          this.cdr.detectChanges();
        }, 0);

        const usernameIDParam = this.route.snapshot.paramMap.get('usernameID');
        this.usernameID = usernameIDParam;

        if (this.usernameID !== this.username) {
          this.route1.navigate(['**'])
          this.location.replaceState(`/user/${this.username}`);
        }
      },
      (err) => {
        if (err.status === 401) {
          localStorage.removeItem('token');
          // Handle token expiration here, e.g., show a message or perform a logout action
        }
      }
    );



    const headerCells: any = document.getElementsByClassName('header-table');

    var maxLen: number = 0
    for (var i = 0; i < 4; i++) {
      if (maxLen < (headerCells[i].innerText).length) {
        maxLen = (headerCells[i].innerText).length
      }
    }

    headerCells[1].style.width = (maxLen * 14.5) + 'px'

    if (window.innerWidth <= 600) {
      headerCells[1].style.width = (maxLen * 10) + 'px'
    }

  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  imageName = this.getRandomInt(1, 30)

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


}
