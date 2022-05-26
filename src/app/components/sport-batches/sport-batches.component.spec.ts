import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SportBatchesComponent } from './sport-batches.component';

describe('SportBatchesComponent', () => {
  let component: SportBatchesComponent;
  let fixture: ComponentFixture<SportBatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SportBatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SportBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
