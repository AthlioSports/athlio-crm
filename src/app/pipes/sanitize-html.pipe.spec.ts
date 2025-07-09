import { TestBed } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';

describe('SanitizeHtmlPipe', () => {
  let pipe: SanitizeHtmlPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule]
    });
    const sanitizer = TestBed.inject(DomSanitizer);
    pipe = new SanitizeHtmlPipe(sanitizer);
  });

  it('removes script tags from html', () => {
    const html = '<p>Hello</p><script>alert(1)</script>';
    const sanitized = pipe.transform(html);
    expect(sanitized).toContain('<p>Hello</p>');
    expect(sanitized).not.toContain('<script>');
  });
});
