import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsComponent } from './blogs.component';
import { SanitizeHtmlPipe } from '../../pipes/sanitize-html.pipe';

describe('BlogsComponent', () => {
  let component: BlogsComponent;
  let fixture: ComponentFixture<BlogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogsComponent, SanitizeHtmlPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sanitize selectedBlog content', () => {
    component.selectedBlog = { content: '<p>Hi</p><script>alert(1)</script>' };
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement.querySelector('.about-academy-blogs span');
    expect(element.innerHTML).toContain('<p>Hi</p>');
    expect(element.innerHTML).not.toContain('<script>');
  });
});
