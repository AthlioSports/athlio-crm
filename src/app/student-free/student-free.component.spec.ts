import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFreeComponent } from './student-free.component';

describe('StudentFreeComponent', () => {
  let component: StudentFreeComponent;
  let fixture: ComponentFixture<StudentFreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentFreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentFreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
