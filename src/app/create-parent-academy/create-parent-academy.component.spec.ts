import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateParentAcademyComponent } from './create-parent-academy.component';

describe('CreateParentAcademyComponent', () => {
  let component: CreateParentAcademyComponent;
  let fixture: ComponentFixture<CreateParentAcademyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateParentAcademyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateParentAcademyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
