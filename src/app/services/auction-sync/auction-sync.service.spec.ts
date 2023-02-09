import { TestBed } from '@angular/core/testing';

import { AuctionSyncService } from './auction-sync.service';

describe('AuctionSyncService', () => {
  let service: AuctionSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuctionSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
