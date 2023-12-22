import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  host: {
    '(document:click)': 'onClick($event)'
  }
})
export class ClickOutsideDirective {

  constructor(private elementRef: ElementRef) {
  }

  onClick(event) {
    if (!this.elementRef.nativeElement.contains(event.target)) { }
    // or some similar check

    //alert('clicked')
    //doSomething();
  }

}
