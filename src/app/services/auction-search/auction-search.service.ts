import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import Auction from 'src/app/models/auction.model';
import { AuctionService } from '../auction/auction.service';
import { AuctionSort } from './auction-sort.enum';

@Injectable({
  providedIn: 'root'
})
export class AuctionSearchService {

  constructor(
    private auctions: AuctionService
  ) { }

  // Get all auctions in the marekt by title, price min / max, and sort them
  public get(search: String, minPrice: number, maxPrice: number, sort: AuctionSort): Observable<Auction[]> {
    return this.auctions.getAll()
      .pipe(
        // Remove expired auctions
        map(auctions => auctions.filter(auction => auction.expirationTimestamp > Date.now())),

        // Filter by search
        map(auctions => auctions.filter(auction => auction.title.toLowerCase().includes(search.toLowerCase()))),

        // Filter by price min / max
        map(auctions => auctions.filter(auction => {
          // Get the last bid price
          const lastBidPrice = auction.bids[auction.bids.length - 1].price;

          // Check if the last bid price is between the min / max price
          return lastBidPrice >= minPrice && lastBidPrice <= maxPrice;
        })),

        // Sort it
        map(auctions => auctions.sort(this.getSortMethod(sort)))
      );
  }

  // Sort the auctions
  private getSortMethod(sort: AuctionSort): (a: Auction, b: Auction) => number {
    switch (sort) {
      // Sort alphabetically by title
      case AuctionSort.TITLE:
        return (a, b) => a.title.localeCompare(b.title);

      // Sort by bid price
      case AuctionSort.BID_PRICE:
        return (a, b) => a.bids[a.bids.length - 1].price - b.bids[b.bids.length - 1].price;

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
        return (a, b) => a.creationTimestamp - b.creationTimestamp;

      // Sort by oldest
      case AuctionSort.OLDEST:
        return (a, b) => b.creationTimestamp - a.creationTimestamp;
    }
  }
}
