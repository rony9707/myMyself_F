import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-under-construction',
  templateUrl: './under-construction.component.html',
  styleUrls: ['./under-construction.component.css']
})
export class UnderConstructionComponent implements OnInit {

  constructor() {
    // console.log('Under Constrution Component Loaded');
   }

  ngOnInit(): void {
  }
  
  defaultX=200
  defaultY=400

  onMouseMove = (event: MouseEvent) => {
    var pos=document.getElementById('main')
    pos?.style.setProperty('--x',event.clientX + "px");
    pos?.style.setProperty('--y',event.clientY + "px");
  }

  onTouchMove = (event: TouchEvent) => {
    var pos=document.getElementById('main')
    pos?.style.setProperty('--x',event.touches[0].clientX + "px");
    pos?.style.setProperty('--y',event.touches[0].clientY + "px");
  }

}
