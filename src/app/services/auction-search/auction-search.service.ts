import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import Auction from 'src/app/models/auction.model';
import { AuctionService } from '../auction/auction.service';
import { AuctionUtils } from '../utils/auction.utils';
import { AuctionSort } from './auction-sort.enum';

@Injectable({
  providedIn: 'root'
})
export class AuctionSearchService {

  // Last result
  private keyword: string = '';
  private minPrice: number | null = null;
  private maxPrice: number | null = null;
  private sort: AuctionSort = AuctionSort.A_Z;
  private lastResult: Observable<Auction[]> | null = null;

  // Construct the auction service
  constructor(
    private auctions: AuctionService,
    private utils: AuctionUtils
  ) { }

  // Get the last result
  public getLastResult(): { keyword: string, minPrice: number | null, maxPrice: number | null, sort: AuctionSort, list: Observable<Auction[]> } | null {

    // Check if there is a last result
    if (this.lastResult == null) {
      return null;
    }

    // Return the last result
    return {
      keyword: this.keyword,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      sort: this.sort,
      list: this.lastResult
    };
  }

  // Clear the last result
  public clearLastResult(): void {
    this.lastResult = null;
  }

  // Get all auctions in the marekt by keyword, price min / max, and sort them
  public get(keyword: string, minPrice: number, maxPrice: number, sort: AuctionSort): Observable<Auction[]> {
    // Get the result based off keyword and filters
    let result = this.auctions.getAll()
      .pipe(
        // Remove expired auctions
        map(auctions => {
          return auctions
            // Filter out expired auctions and auctions that have been purchased
            .filter(auction => auction.expirationTimestamp > Date.now() && auction.purchase == null)

            // Filter the auctions by search
            .filter(auction => auction.title.toLowerCase().includes(keyword.toLowerCase()))

            // Filter the auctions by price
            .filter(auction => {
              // Get the last bid price
              const lastBidPrice = auction.bids.length > 0 ? auction.bids[auction.bids.length - 1].price : auction.startBid;

              // Check if the last bid price is between the min / max price
              return lastBidPrice >= minPrice && lastBidPrice <= maxPrice;
            })

            // Sort the auctions
            .sort(this.getSortMethod(sort));
        }),
      );

    // Save the last result
    this.keyword = keyword;
    this.minPrice = minPrice == Number.MIN_VALUE ? null : minPrice;
    this.maxPrice = maxPrice == Number.MAX_VALUE ? null : maxPrice;
    this.sort = sort;
    this.lastResult = result;

    // Return the list of auctions
    return result;
  }

  // Sort the auctions
  private getSortMethod(sort: AuctionSort): (a: Auction, b: Auction) => number {
    switch (sort) {
      // Sort alphabetically by title
      case AuctionSort.A_Z:
        return (a, b) => a.title.localeCompare(b.title);

      // Sort reverse alphabetically by title
      case AuctionSort.Z_A:
        return (a, b) => b.title.localeCompare(a.title);

      // Sort by bid price
      case AuctionSort.BID_PRICE:
        return (a, b) => this.utils.getCurrentBid(a) - this.utils.getCurrentBid(b);

      // Sort by total bids
      case AuctionSort.TOTAL_BIDS:
        return (a, b) => a.bids.length - b.bids.length;

      // Sort by BIN price
      case AuctionSort.BIN_PRICE:
        return (a, b) => a.binPrice - b.binPrice;

      // Sort by time left
      case AuctionSort.TIME_LEFT:
        return (a, b) => (a.expirationTimestamp - Date.now()) - (b.expirationTimestamp - Date.now());

      // Sort by newest
      case AuctionSort.NEWEST:
        return (a, b) => b.creationTimestamp - a.creationTimestamp;

      // Sort by oldest
      case AuctionSort.OLDEST:
        return (a, b) => a.creationTimestamp - b.creationTimestamp;
    }
  }
}
