import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeReportByPaymentTypeComponent } from './fee-report-by-payment-type.component';

describe('FeeReportByPaymentTypeComponent', () => {
  let component: FeeReportByPaymentTypeComponent;
  let fixture: ComponentFixture<FeeReportByPaymentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeReportByPaymentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeReportByPaymentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
