import { Component, Input, TRANSLATIONS } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Auction from '../models/auction.model';
import { AuctionService } from '../services/auction/auction.service';

@Component({
  selector: 'app-page-view-auction',
  templateUrl: './page-view-auction.component.html',
  styleUrls: ['./page-view-auction.component.css']
})
export class PageViewAuctionComponent {

  // The auction
  protected auction: Auction | undefined;

  // Check if the viewer is the seller
  protected isSeller: boolean = false;

  // Control input for the bid amount
  protected bid = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private auctions: AuctionService
  ) { }

  ngOnInit(): void {
    // Log loading of auction
    console.log('Loading auction...');

    // Get the auction id from the query parameter
    this.route.paramMap.subscribe(params => {

      // The auction id
      let id = params.get('auctionId');

      // Check if exists
      if (id) {

        // Get the auction from the auction service
        this.auctions.get(id).subscribe(res => {

          // Check if the auction exists
          if (res === null) {
            console.log('Auction not found');
            return;
          }

          // Set the auction
          this.auction = res;

          // Log the auction
          console.log(this.auction);
        });
      }
    });

    // TODO: Check if the viewer is the seller
  }

  // Called when a user tries to bid on an auction.
  protected onBid(): void {

    console.log('Received bid of ' + this.bid.value + ' from user');

  }

  // Called when a user tries to buy an auction.
  protected onBuy(): void {
  }

  // Called when a user tries to edit the auction
  protected onEdit(): void {
  }

}
