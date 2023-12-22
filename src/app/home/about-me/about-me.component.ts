import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css']
})
export class AboutMeComponent implements OnInit {

  constructor() { 
    // console.log('About Me Component Loaded');

  }

  ngOnInit(): void {

    // Create a new Intersection Observer instance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show'); // Remove the dot (.) before 'show'
        } else {
          entry.target.classList.remove('show'); // Remove the dot (.) before 'show'
        }
      });
    });

    
    // Get all elements with the class "hidden"
    const hiddenElements = document.querySelectorAll('.hidden'); // Use querySelectorAll
    // Observe each hidden element
    hiddenElements.forEach((el) => observer.observe(el)); // Use lowercase 'observer'

  }



}
