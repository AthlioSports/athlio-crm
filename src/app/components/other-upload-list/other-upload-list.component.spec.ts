import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherUploadListComponent } from './other-upload-list.component';

describe('OtherUploadListComponent', () => {
  let component: OtherUploadListComponent;
  let fixture: ComponentFixture<OtherUploadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherUploadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherUploadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
