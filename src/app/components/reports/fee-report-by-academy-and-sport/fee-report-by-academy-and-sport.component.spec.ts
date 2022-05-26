import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeReportByAcademyAndSportComponent } from './fee-report-by-academy-and-sport.component';

describe('FeeReportByAcademyAndSportComponent', () => {
  let component: FeeReportByAcademyAndSportComponent;
  let fixture: ComponentFixture<FeeReportByAcademyAndSportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeReportByAcademyAndSportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeReportByAcademyAndSportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
