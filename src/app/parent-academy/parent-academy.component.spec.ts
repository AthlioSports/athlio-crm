import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentAcademyComponent } from './parent-academy.component';

describe('ParentAcademyComponent', () => {
  let component: ParentAcademyComponent;
  let fixture: ComponentFixture<ParentAcademyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentAcademyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentAcademyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
