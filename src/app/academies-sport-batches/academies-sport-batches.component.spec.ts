import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademiesSportBatchesComponent } from './academies-sport-batches.component';

describe('AcademiesSportBatchesComponent', () => {
  let component: AcademiesSportBatchesComponent;
  let fixture: ComponentFixture<AcademiesSportBatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademiesSportBatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademiesSportBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
