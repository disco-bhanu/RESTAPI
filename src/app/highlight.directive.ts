import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(private el: ElementRef) { }

    @HostListener('click') onClick() {
      console.log('Clicked');
      console.log(this.el);
      this.highlight('Orange');
    }

    private highlight(color: String) {
      this.el.nativeElement.style.borderBottomColor = color;
      this.el.nativeElement.style.borderBottomStyle = 'Solid';
    }

}
