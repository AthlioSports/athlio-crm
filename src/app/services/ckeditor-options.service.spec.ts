import { TestBed } from '@angular/core/testing';

import { CkeditorOptionsService } from './ckeditor-options.service';

describe('CkeditorOptionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CkeditorOptionsService = TestBed.get(CkeditorOptionsService);
    expect(service).toBeTruthy();
  });
});
