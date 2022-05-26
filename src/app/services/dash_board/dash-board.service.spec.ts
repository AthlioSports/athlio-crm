import { TestBed } from '@angular/core/testing';

import { DashBoardService } from './dash-board.service';

describe('DashBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashBoardService = TestBed.get(DashBoardService);
    expect(service).toBeTruthy();
  });
});
