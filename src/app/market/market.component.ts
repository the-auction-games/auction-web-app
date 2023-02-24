import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { interval, Observable } from 'rxjs';
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

  // Object for refreshing
  protected refresh = {
    keyword: '',
    minPrice: Number.MIN_VALUE,
    maxPrice: Number.MAX_VALUE,
    sort: AuctionSort.A_Z
  }

  // The login form
  protected searchForm = new FormGroup({
    keyword: new FormControl(this.refresh.keyword),
    minPrice: new FormControl(undefined),
    maxPrice: new FormControl(undefined),
    sort: new FormControl(this.refresh.sort)
  });

  // The sort options
  protected sortOptions = [

    // TODO: LOAD FROM ENUM

    AuctionSort.A_Z,
    AuctionSort.Z_A,
    AuctionSort.BID_PRICE,
    AuctionSort.TOTAL_BIDS,
    AuctionSort.BIN_PRICE,
    AuctionSort.TIME_LEFT,
    AuctionSort.NEWEST,
    AuctionSort.OLDEST
  ];

  // Interval id
  private intervalId: NodeJS.Timer | undefined;

  // Construct the market with the auction service
  constructor(
    private search: AuctionSearchService
  ) {}

  // Initialize the market
  ngOnInit(): void {
    // Init sort options from enum
    // TODO: INIT IT HERE

    // Load all auctions
    this.refreshAuctions();

    // Load all auctions on init & refresh every 5 seconds\
    this.intervalId = setInterval(() => {
      this.refreshAuctions();
    }, 5000);
  }

  // Destroy the refresh interval
  ngOnDestroy(): void {
    // Clear the interval
    clearInterval(this.intervalId);
  }

  // Refresh the auctions
  private refreshAuctions(): void {
    // Refresh all auctions that meet the last search requirements
    this.search.get(this.refresh.keyword, this.refresh.minPrice, this.refresh.maxPrice, this.refresh.sort).subscribe(auctions => this.allAuctions = auctions);
  }

  // Called on submit
  protected onSubmit(): void {
    // Update the refresh object
    this.refresh.keyword = this.getKeyword();
    this.refresh.minPrice = this.getMinPrice();
    this.refresh.maxPrice = this.getMaxPrice();
    this.refresh.sort = this.getSort();

    // Get the search results and update the page
    this.getSearchResults().subscribe(auctions => this.allAuctions = auctions);
  }

  // Get the auctions based off the search result
  protected getSearchResults(): Observable<Auction[]> {
    // Search for the auctions
    return this.search.get(this.getKeyword(), this.getMinPrice(), this.getMaxPrice(), this.getSort());
  }

  // Get the form keyword or default to empty string
  private getKeyword(): string {
    return this.searchForm.controls.keyword.value || '';
  }

  // Get the form min price or default to min value
  private getMinPrice(): number {
    return this.searchForm.controls.minPrice.value || Number.MIN_VALUE;
  }

  // Get the form max price or default to max value
  private getMaxPrice(): number {
    return this.searchForm.controls.maxPrice.value || Number.MAX_VALUE;
  }

  // Get the form sort or default to title
  private getSort(): AuctionSort {
    return this.searchForm.controls.sort.value || AuctionSort.A_Z;
  }
}
