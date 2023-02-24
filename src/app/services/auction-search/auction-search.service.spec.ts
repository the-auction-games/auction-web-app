import { TestBed } from '@angular/core/testing';

import { AuctionSearchService } from './auction-search.service';

describe('AuctionSearchService', () => {
  let service: AuctionSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuctionSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
