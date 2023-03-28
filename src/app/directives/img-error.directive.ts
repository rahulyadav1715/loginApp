import { Input, Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
  selector: 'img[appImgError]'
})
export class ImageErrorDirective {

  @Input() elementId!: any;
  constructor(private el: ElementRef) {

  }

  @HostListener('error')
  private onError(): any {
    // return 'Image not found';
    this.el.nativeElement.style.display = 'none';
  }
}
