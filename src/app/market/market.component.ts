import { ChangeDetectorRef, Component } from '@angular/core';
import Auction from '../models/auction.model';
import { AuctionSearchService } from '../services/auction-search/auction-search.service';
import { AuctionSort } from '../services/auction-search/auction-sort.enum';
import { AuctionService } from '../services/auction/auction.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent {

  // All auctions in the market
  protected allAuctions: Auction[] = [];

  // TODO: SEARCH BAR

  // TODO: FILTER BY PRICE MIN / MAX

  // TODO: SORT BY: TITLE, BID PRICE, TOTAL BIDS, BIN PRICE, TIME LEFT, NEWEST, OLDEST


  // Construct the market with the auction service
  constructor(
    private search: AuctionSearchService
  ) { }

  // Initialize the market
  ngOnInit(): void {
    // Load all auctions
    this.refreshAuctions();

    // Load all auctions on init & refresh every 5 seconds\
    setInterval(() => {
      this.refreshAuctions();
    }, 5000);
  }

  // Refresh the auctions
  private refreshAuctions(): void {
    this.search.get('', 100, 200, AuctionSort.TITLE).subscribe(auctions => this.allAuctions = auctions);
  }
}
