import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademiesListComponent } from './academies-list.component';

describe('AcademiesListComponent', () => {
  let component: AcademiesListComponent;
  let fixture: ComponentFixture<AcademiesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademiesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
