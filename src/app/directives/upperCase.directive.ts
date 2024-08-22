// uppercase.directive.ts
import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private ngControl: NgControl
  ) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const uppercaseValue = value.toUpperCase();
    this.renderer.setProperty(this.el.nativeElement, 'value', uppercaseValue);
    this.ngControl.control?.setValue(uppercaseValue, { emitEvent: false });
  }
}
