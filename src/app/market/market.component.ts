import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import Auction from '../models/auction.model';
import { AuctionSearchService } from '../services/auction-search/auction-search.service';
import { AuctionSort } from '../services/auction-search/auction-sort.enum';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent {

  // All auctions in the market
  protected allAuctions: Auction[] = [];

  // The search form
  protected searchForm = new FormGroup({
    keyword: new FormControl(''),
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
    sort: new FormControl(AuctionSort.A_Z)
  });

  // The sort options
  protected sortOptions: AuctionSort[] = [];

  // Construct the market with the auction service
  constructor(
    private search: AuctionSearchService,
    private route: ActivatedRoute,
  ) { }

  // Initialize the market
  ngOnInit(): void {
    // Dynamically load enum types
    this.sortOptions = Object.keys(AuctionSort).map(key => AuctionSort[key as keyof typeof AuctionSort]);

    // Load last result if it exists
    this.route.queryParamMap.subscribe(params => {
      // The query
      let query = params.get('useLastResult');
      let useLastResult = query != null && query.toLowerCase() == 'true';

      // Check if we should use the last result
      if (useLastResult) {
        // Get the last search result
        let result = this.search.getLastResult();

        // Check if there is a last result
        if (result != null) {
          // Set the search form
          this.searchForm.controls.keyword.setValue(result.keyword);
          this.searchForm.controls.minPrice.setValue(result.minPrice);
          this.searchForm.controls.maxPrice.setValue(result.maxPrice);
          this.searchForm.controls.sort.setValue(result.sort);

          // Load the last result
          result.list.subscribe(auctions => this.allAuctions = auctions);
        } else {
          // Don't use the last result, force reset
          useLastResult = false;
        }
      }

      // Reset the search
      if (!useLastResult) {
        this.onResetSearch();
      }
    });
  }

  // Called on submit
  protected onSubmit(): void {
    // Process the search
    this.processSearch();
  }

  protected processSearch() {
    // Get the search results and update the page
    this.getSearchResults().subscribe(auctions => this.allAuctions = auctions);
  }

  // Get the auctions based off the search result
  protected getSearchResults(): Observable<Auction[]> {
    // Search for the auctions
    return this.search.get(this.getKeyword(), this.getMinPrice(), this.getMaxPrice(), this.getSort());
  }

  // Called on reset
  protected onResetSearch(): void {
    // Clear the search form
    this.searchForm.reset();
    this.searchForm.controls.sort.setValue(AuctionSort.A_Z);

    // Refresh the auctions
    this.processSearch();
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
