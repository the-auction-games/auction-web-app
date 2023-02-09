import { ChangeDetectorRef, Injectable } from '@angular/core';
import Auction from 'src/app/models/auction.model';
import { AuctionService } from '../auction/auction.service';

// Service used to sync the auction details with the server
@Injectable({
  providedIn: 'root'
})
export class AuctionSyncService {

  // Construct the auction sync service
  constructor(private auctions: AuctionService) { }

  // Method called to update the auction details.
  //
  // Returns the interval timer. Call clearInterval(timer) to stop the update.
  public updateAuction(auction: Auction | null | undefined, interval: number): NodeJS.Timer {

    // Update the auction details per interval
    return setInterval(() => {

      // Update the auction details if the auction is not null
      if (auction) this.updateAuctionDetails(auction);

    }, interval);
  }

  // Method called to update the auction details
  private updateAuctionDetails(auction: Auction): void {

    // Get the updated auction
    this.auctions.get(auction.id).subscribe(updatedAuction => {

      // Update the auction if it is not null
      if (updatedAuction !== null) {

        // Update the auction
        auction.title = updatedAuction.title;
        auction.description = updatedAuction.description;
        auction.startBid = updatedAuction.startBid;
        auction.bids = updatedAuction.bids; // TODO: THIS WILL REQUIRE TESTING
        auction.binPrice = updatedAuction.binPrice;
        auction.base64Image = updatedAuction.base64Image;
        auction.creationTimestamp = updatedAuction.creationTimestamp;
        auction.expirationTimestamp = updatedAuction.expirationTimestamp;

        // Log the update
        console.log(auction);
      }

    });
  }
}
