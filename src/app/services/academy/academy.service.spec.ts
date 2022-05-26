import { TestBed } from '@angular/core/testing';

import { AcademyService } from './academy.service';

describe('AcademyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AcademyService = TestBed.get(AcademyService);
    expect(service).toBeTruthy();
  });
});
