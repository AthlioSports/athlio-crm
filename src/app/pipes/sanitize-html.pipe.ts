import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SecurityContext } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml'
})
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): string {
    return value ? (this.sanitizer.sanitize(SecurityContext.HTML, value) || '') : '';
  }
}
