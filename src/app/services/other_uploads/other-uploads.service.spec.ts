import { TestBed } from '@angular/core/testing';

import { OtherUploadsService } from './other-uploads.service';

describe('OtherUploadsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OtherUploadsService = TestBed.get(OtherUploadsService);
    expect(service).toBeTruthy();
  });
});
