import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { UserdataService } from 'src/app/services/userdata.service';
import { NgModel } from '@angular/forms';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('myCanvas', { static: true }) canvas: ElementRef<HTMLCanvasElement> | undefined;
  constructor(
    private userData: UserdataService
  ) {
    // console.log('Home Component Loaded'); 
  }

  colorPicked: any = localStorage.getItem('color-picked')
  brushSize: any = localStorage.getItem('brush-size')
  defaultBrushSize: any = 50;
  bgColor: any = localStorage.getItem('bg-color')
  ngOnInit() {
    //initialize canvas
    this.initializeCanvas();
  }

  private initializeCanvas() {
    if (!this.canvas) return;
    const canvasContainer: HTMLCanvasElement | null = document.querySelector("#canvas-container");
    const ctx: any = this.canvas.nativeElement.getContext("2d");


    let drawingData: ImageData | null = null; // Store drawing data

    // Set the Dimensions of canvas
    const setCanvasDimensions = () => {
      loadCanvas()
      if (!canvasContainer || !this.canvas || !this.canvas.nativeElement) return; // Null checks
      const scaleFactor = window.devicePixelRatio;

      // Store the existing drawings before resizing
      drawingData = ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

      // Check if the browser width is equal to or lower than 600px
      if (window.innerWidth < 600) {
        this.canvas.nativeElement.width = Math.round(canvasContainer.clientWidth * scaleFactor * 0.95);
      } else {
        this.canvas.nativeElement.width = Math.round(canvasContainer.clientWidth * 0.958);
      }

      // Set the canvas height to match the window height
      this.canvas.nativeElement.height = Math.round(window.innerHeight * scaleFactor);

      // Set the canvas context scale
      ctx.scale(scaleFactor, scaleFactor);
    }

    // Initial dimensions
    setCanvasDimensions();

    // Update dimensions when the window is resized
    window.addEventListener("resize", setCanvasDimensions);

    //Function to load the canvas from local stroage
    function loadCanvas() {
      const dataURL = localStorage.getItem("myCanvas");
      const img: any = new Image();
      const scaleFactor = window.devicePixelRatio;
      img.src = dataURL;
      img.onload = function () {
        ctx.drawImage(img, 0, 0, img.width / scaleFactor, img.height / scaleFactor);
      };
    }


    //Initialize load canvas
    loadCanvas()

    let painting = false;
    let mouseInsideCanvas = false;

    function startPosition(e) {
      painting = true
      draw(e)
      draw_touch(e)
    }

    function endPosition(e) {
      painting = false
      ctx.beginPath();
    }

    const draw = (e) => {
      if (!painting || !this.canvas) return; // Null checks
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;



      ctx.imageSmoothingEnabled = true;

      ctx.lineWidth = localStorage.getItem('brush-size');
      ctx.lineCap = "round";
      ctx.strokeStyle = localStorage.getItem('color-picked');

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y)
      saveCanvas()
    }

    const draw_touch = (e) => {
      e.preventDefault();
      if (!painting || !this.canvas || !e.touches) return; // Null checks
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const x_touch = e.touches[0].clientX - rect.left;
      const y_touch = e.touches[0].clientY - rect.top;

      ctx.imageSmoothingEnabled = true;

      ctx.lineWidth = localStorage.getItem('brush-size');
      ctx.lineCap = "round";
      ctx.strokeStyle = localStorage.getItem('color-picked');


      ctx.lineTo(x_touch, y_touch);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x_touch, y_touch);
      saveCanvas()
    }

    //Function to save canvas in local stroage
    const saveCanvas = () => {
      if (!this.canvas) return; // Null checks
      localStorage.setItem("myCanvas", this.canvas.nativeElement.toDataURL());
    }

    // Event Listeners
    //For desktop
    this.canvas.nativeElement.addEventListener('mousedown', startPosition)
    this.canvas.nativeElement.addEventListener('mouseup', endPosition)
    this.canvas.nativeElement.addEventListener('mousemove', draw)
    this.canvas.nativeElement.addEventListener('mouseleave', (e) => {
      if (e.buttons === 1) { // Check if the left mouse button is pressed
        startPosition(e);
      } else {
        endPosition(e);
      }
    });

    //For Mobile
    this.canvas.nativeElement.addEventListener('touchstart', startPosition);
    this.canvas.nativeElement.addEventListener('touchend', endPosition);
    this.canvas.nativeElement.addEventListener('touchmove', draw_touch);

    //To set min and max values based on device type
    const slider: any = document.getElementById('brush-slider');

    // Function to set min and max values based on device type
    function setMinMaxValues() {
      if (!slider) return;
      if (isMobileDevice()) {
        slider.min = 1; // Set the minimum value for mobile
        slider.max = 100; // Set the maximum value for mobile
      } else {
        slider.min = 1; // Set the minimum value for desktop
        slider.max = 200; // Set the maximum value for desktop
      }
    }

    // Function to detect if the device is mobile
    function isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Call the setMinMaxValues function to set initial values
    setMinMaxValues();
  }


  saveImage() {
    const canvas: HTMLCanvasElement | null = document.querySelector("#canvas");


    function formatDateToYYYYMMDDHHMMSS(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}${month}${day} ${hours}:${minutes}:${seconds}`;
    }
    const currentDateTime = new Date();
    const formattedDateTime = formatDateToYYYYMMDDHHMMSS(currentDateTime);

    if (canvas) {
      const link = document.createElement('a');
      link.download = `${formattedDateTime}_ImageDownload.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  }


  clickColor(colorName: string) {
    // const color: any = document.getElementById(colorName);
    // this.colorPicked = color.getAttribute("value");
    // console.log(this.colorPicked)
    // localStorage.setItem("color-picked", this.colorPicked)
    this.colorPicked = colorName
    localStorage.setItem("color-picked", this.colorPicked)
  }

  pickCustomerColor() {
    const color: any = document.getElementById("colorpicker");
    this.colorPicked = color.value;
    localStorage.setItem("color-picked", this.colorPicked)
  }

  eraser() {
    const BGcolor: any = document.getElementById("backgroundColorPicker");
    this.colorPicked = BGcolor.value
    localStorage.setItem("color-picked", this.colorPicked)
  }

  clearCanvas() {
    const BGcolor: any = document.getElementById("backgroundColorPicker");
    this.bgColor = BGcolor.value
    if (!this.canvas) return;
    const ctx: any = this.canvas.nativeElement.getContext("2d");
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  pickSliderValue() {
    const sliderValue: any = document.getElementById("brush-slider");
    this.brushSize = sliderValue.value
    localStorage.setItem("brush-size", this.brushSize)
  }


  pickBackgroudColor() {
    const BGcolor: any = document.getElementById("backgroundColorPicker");
    this.bgColor = BGcolor.value
    localStorage.setItem("bg-color", this.bgColor)
    if (!this.canvas) return;
    const ctx: any = this.canvas.nativeElement.getContext("2d");
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.saveCanvas()
  }

  showTools() {
    const toolsElement: any = document.getElementById('tools');
    const toolsElementButton: any = document.getElementById('toggle-btn');
    toolsElement.classList.toggle('active');
    toolsElementButton.classList.toggle('active');
    // if (toolsElement) {
    //   toolsElement.classList.toggle('active');
    // }

  }

  saveCanvas() {
    if (!this.canvas) return; // Null checks
    localStorage.setItem("myCanvas", this.canvas.nativeElement.toDataURL());
  }








}