import { Component, ElementRef, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { UserdataService } from 'src/app/services/userdata.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridReadyEvent,
  FilterChangedEvent,
  FilterModifiedEvent,
  FilterOpenedEvent,
  INumberFilterParams,
  ITextFilterParams,
  ProvidedFilter
} from 'ag-grid-community';




@Component({
  selector: 'app-user-welcome',
  templateUrl: './user-welcome.component.html',
  styleUrls: ['./user-welcome.component.css']
})
export class UserWelcomeComponent implements OnInit {

  username: any = '';
  firstname: any = '';
  lastname: any;
  imageUrl: string | ArrayBuffer | null = null;
  email: any = '';
  age: any
  LastLogin: any
  dob: any
  date = new Date();
  data: any;


  colDefs: any
  defColDef: any
  rowData: any
  table_theme: any



  constructor(
    private userData: UserdataService,
    private route: ActivatedRoute,
    private route1: Router,
    private location: Location,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private renderer: Renderer2
  ) {
    // console.log('Welcome User Module Loaded');

  }


  public usernameID;

  public intervalId_checkTargetHitOrNot: any;

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

        if (currentMMDD >= userMMDD) {
          this.age
        } else {
          this.age = (parseInt(this.age) - 1).toString()
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


    //Code for table which shows user info
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


    //Check if target is hit or not
    this.intervalId_checkTargetHitOrNot = setInterval(() => {
      if (this.hasGameStarted == true && this.restartGame == false) {
        this.checkTargetHit();
      }
      this.getScoreboardData();
    }, 1500);


    //Table Data
    this.colDefs = [
      { headerName: 'Name', field: 'firstName', width: 130, filter: 'agTextColumnFilter' }
      ,
      {
        headerName: 'Targets Hit', field: 'targetsHit', width: 120, filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        }
      }
      ,
      {
        headerName: 'Timer(s)', field: 'Timer', width: 110, filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['reset', 'apply'],
        }
      }
      ,
      {
        headerName: 'Shorts Taken', field: 'shotsTaken', width: 120, filter: 'agNumberColumnFilter'
        ,
        filterParams: {
          buttons: ['reset', 'apply'],
        }
      }
      ,
      {
        headerName: 'Accuracy', field: 'Accuracy', width: 100, filter: 'agNumberColumnFilter'
        ,
        filterParams: {
          buttons: ['reset', 'apply'],
        }
      }
      ,
      {
        headerName: 'Score Submit Date', field: 'dteSubmit', width: 200,
        filterParams: {
          buttons: ['reset', 'apply'],
        }
      }
    ]

    this.defColDef = {
      sortable: true,
      filter: true,
      floatingFilter: true,
      resizable: true,
      suppressMenu: true
    }

    //controls the table responsible in reference to window width
    const windowWidth = window.innerWidth;

    if (windowWidth >= 779 && windowWidth <= 1318) {
      // Add flex: 1
      this.defColDef = { ...this.defColDef, flex: 1 };
    } else if (windowWidth <= 778) {
      // Remove flex property from the object
      const { flex, ...updatedDefColDef } = this.defColDef;
      this.defColDef = updatedDefColDef;
    } else {
      // Default case if none of the conditions match
      // You may handle additional cases here or leave it empty
    }


    const storedTheme = localStorage.getItem('PageTheme');

    if (storedTheme === '"Dark Mode"') {
      this.table_theme = "ag-theme-alpine-dark";
    } else if (storedTheme === '"Light Mode"') {
      this.table_theme = "ag-theme-alpine";
    } else {
      this.table_theme = "ag-theme-alpine";
    }


  }

  formatDate1(params: any) {
    return this.datePipe.transform(params.value, 'MMMM d, y, h:mm:ss a');
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


  //Code for background Image change
  imageName = this.getRandomInt(1, 30)

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  //Get scoreboard data from backend
  getScoreboardData() {
    //Get Leaderboard from backend
    this.userData.getLeaderBoard().subscribe(
      (data: any) => {
        // Log the original data

        // // Modify the 'Timer' property by adding 's' to every value
        // const modifiedData = data.map((item: any) => {
        //   return {
        //     ...item,
        //     Timer: `${item.Timer} s`,
        //   };
        // });

        // // Log the modified data

        // Assign the modified data to rowData
        this.rowData = data;
      },
      (err) => {
        if (err.status === 401) {
          // Handle 401 error
        }
      }
    );
  }





  //Code for aimgame------------------------------------------------
  hasGameStarted: boolean = false
  gameStartTime: number = 0;
  intervalId: any; // Variable to store the interval ID
  score = 0
  shotsTaken = 0
  targetVanishCount: number = 3;
  accuracy = 0
  restartGame: boolean = false


  clickHandler: any;
  clickHandler1: any;
  isButtonDisabled: boolean = false;


  startGame() {
    this.score = 0;
    this.gameStartTime = 0;
    this.hasGameStarted = true; // hides the start button after the game has started
    this.restartGame = false
    this.shotsTaken = -1;
    this.accuracy = 0;
    this.targetVanishCount = 3

    const gameDiv: any = document.getElementById('game');
    const target: any = document.getElementById('target');
    target.setAttribute('data-hit', 'true');

    this.renderer.setStyle(target, 'display', 'block');

    // Function to get a random position within the boundaries of gameDiv
    this.setTargetAtRandomLocation();

    // Define the click handler
    this.clickHandler = (event: any) => {
      // Check if the clicked element is the target
      if (event.target.id === 'target') {
        this.trackScore();
      } else {
      }
      this.shotsTaken = this.shotsTaken + 1;
      this.calculateAccuracy()

      // Play the gun sound
      if (this.score > 0) {
        const gunSound = new Audio();
        gunSound.src = 'assets/game/gun_sound.wav';
        gunSound.play();
      }
    };

    // Add the event listener AFTER the target is displayed
    gameDiv.addEventListener('click', this.clickHandler);

    // Timer code which tracks the time the game is played by the user
    this.intervalId = setInterval(() => {
      this.gameStartTime++;
      // if (this.gameStartTime == 5) {
      //   this.stopGame();
      // }
    }, 1000);

  }

  calculateAccuracy() {
    this.accuracy = (this.score / this.shotsTaken) * 100
    this.accuracy = parseFloat(this.accuracy.toFixed(2));
  }


  showRippleEffect(event: any): void {
    const span: any = document.getElementById("ripple_effect");
    span.style.height = "0px";
    span.style.width = "0px";
    const x = event.clientX;
    const y = event.clientY;
    span.style.display = "inline-block";
    span.style.top = y + "px";
    span.style.left = x + "px";
    span.style.height = "15px";
    span.style.width = "15px";
  }

  checkTargetHit() {
    const target: any = document.getElementById('target');
    // Check if the target was hit within the last second
    if (target.getAttribute('data-hit') === 'true') {
      // Target was hit, reset the 'data-hit' attribute
      target.setAttribute('data-hit', 'false');
      console.log("Target was hit")
    } else if (this.targetVanishCount == 0) {
      this.stopGame();
    } else {
      // Target was not hit, decrease targetVanishCount
      console.log("Target was not hit")
      this.targetVanishCount = this.targetVanishCount - 1;
      const gunSound = new Audio();
      gunSound.src = 'assets/game/gun_missed.mp3';
      gunSound.play();
      // Set a new target after a short delay
      setTimeout(() => {
        this.setTargetAtRandomLocation();
      }, 1500);

      // If targetVanishCount is zero, stop the game
      if (this.targetVanishCount < 0) {
        this.stopGame();
      } else {

      }
    }
  }


  trackScore() {
    const target: any = document.getElementById('target');
    this.setTargetAtRandomLocation();
    this.score = this.score + 1;

    // Set the 'data-hit' attribute to true when the target is hit
    target.setAttribute('data-hit', 'true');
  }


  setTargetAtRandomLocation() {
    const gameDiv: any = document.getElementById('game');
    const target: any = document.getElementById('target');

    // Function to get a random position within the boundaries of gameDiv
    function getRandomPosition() {
      const maxX = gameDiv.clientWidth - target.clientWidth;
      const maxY = gameDiv.clientHeight - target.clientHeight;

      const randomX = Math.floor(Math.random() * maxX);
      const randomY = Math.floor(Math.random() * maxY);

      return { x: randomX, y: randomY };
    }

    // Set the position
    const { x, y } = getRandomPosition();
    target.style.left = `${gameDiv.offsetLeft + x}px`;
    target.style.top = `${gameDiv.offsetTop + y}px`;
  }


  stopGame() {
    this.isButtonDisabled = true;
    this.targetVanishCount = 3;
    clearInterval(this.intervalId);
    //this.hasGameStarted = false//shows the start button after game has started
    this.restartGame = true;
    const target: any = document.getElementById('target');
    this.renderer.setStyle(target, 'display', 'none');

    const ripple: any = document.getElementById('ripple_effect');
    this.renderer.setStyle(ripple, 'display', 'none');

    // Remove the event listener
    const gameDiv: any = document.getElementById('game');
    gameDiv.removeEventListener('click', this.clickHandler);


    // Enable the button after 2 seconds
    setTimeout(() => {
      this.isButtonDisabled = false;
    }, 2000);


  }


  //game code stop--------------------------------------------------

  buttonClasses: { [key: string]: boolean } = {};

  isButtonDisabled1: boolean = false;


  //Sent Data to backend click code-----------------------------------------
  onClick() {
    // Disable the button during the animation
    this.isButtonDisabled1 = true;

    this.buttonClasses = { 'onclic': true };
    setTimeout(() => {
      this.buttonClasses = { 'validate': true };
      setTimeout(() => {
        this.buttonClasses = {}; // Remove all classes
        this.isButtonDisabled1 = false;

        //Code for Sending score to db


        //GET user detail 
        this.userData.users().subscribe(
          (data: any) => {
            this.username = data.username;
            this.firstname = data.firstName;
            this.email = data.email;
          },

          (err) => {
            swal.fire("Error", err.error.message)
          }



        );


        //Create a obj to sent to backend
        let dataSentToBack = {
          firstName: this.firstname,
          userName: this.username,
          email: this.email,
          targethit: this.score,
          timer: this.gameStartTime,
          shotstaken: this.shotsTaken,
          accuracy: this.accuracy + "%"
        }

        // console.log(dataSentToBack)

        this.userData.submitScoreBoardUser(dataSentToBack)
          .subscribe(
            (res) => {
              swal.fire({
                title: "Score Submitted",
                text: res.message,
                icon: "success",
                timer: 2500, // Auto close after 2 seconds
                timerProgressBar: true, // Show progress bar
                showConfirmButton: false // Hide the "OK" button
              });

              //Start the game again after data is sent
              // this.hasGameStarted = false; // hides the start button after the game has started
              // this.restartGame = false;
            },
            (err) => {
              swal.fire("Error", err.error.message)
            }
          )


      }, 1250);
    }, 2250);
  }


  //Sent Data to backend click code stop-----------------------------------------




  //Excel Export--------------------------------------------------
  private gridApi!: GridApi;
  onBtnExport() {
    this.gridApi.exportDataAsCsv();
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  showLeaderboard_value = "Show Ranking"
  showLeaderboard1_value = "Show Ranking"

  //Excel Export STOP--------------------------------------------------


  //Show LeaderBoard Start---------------------------------------------
  showLeaderboard() {
    var scoreboard = document.getElementById("scoreboard");
    var game = document.getElementById("game");



    // Toggle the display property
    if (scoreboard && game)
      // Toggle the display property
      if (scoreboard.style.display === "none" || scoreboard.style.display === "") {
        scoreboard.style.display = "block";
        game.style.display = "none";
        this.showLeaderboard1_value = "Hide Ranking"
      } else {
        scoreboard.style.display = "none";
      }


    const storedTheme = localStorage.getItem('PageTheme');

    if (storedTheme === '"Dark Mode"') {
      this.table_theme = "ag-theme-alpine-dark";
    } else if (storedTheme === '"Light Mode"') {
      this.table_theme = "ag-theme-alpine";
    } else {
      this.table_theme = "ag-theme-alpine";
    }

  }

  showLeaderboard1() {
    var scoreboard = document.getElementById("scoreboard");
    var game = document.getElementById("game");

    // Toggle the display property
    if (scoreboard && game)
      // Toggle the display property
      if (scoreboard.style.display === "block") {
        scoreboard.style.display = "none";
        game.style.display = "flex"
      } else {
        scoreboard.style.display = "block";
      }



    const storedTheme = localStorage.getItem('PageTheme');

    if (storedTheme === '"Dark Mode"') {
      this.table_theme = "ag-theme-alpine-dark";
    } else if (storedTheme === '"Light Mode"') {
      this.table_theme = "ag-theme-alpine";
    } else {
      this.table_theme = "ag-theme-alpine";
    }


  }


  //Show LeaderBoard End---------------------------------------------



}








