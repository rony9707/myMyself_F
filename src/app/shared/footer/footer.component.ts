import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() {
    // console.log('Footer Component Loaded');
   }

  ngOnInit(): void {
  }
  date = new Date();

  goToMyWebsite(){
    window.open('https://my-portfolio-1b0d8.web.app', '_blank');
  }
}
