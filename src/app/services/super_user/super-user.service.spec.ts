import { TestBed } from '@angular/core/testing';

import { SuperUserService } from './super-user.service';

describe('SuperUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuperUserService = TestBed.get(SuperUserService);
    expect(service).toBeTruthy();
  });
});
