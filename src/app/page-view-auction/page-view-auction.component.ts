import { Component, Input, TRANSLATIONS } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Auction from '../models/auction.model';
import Offer from '../models/offer.model';
import { AccountService } from '../services/account/account.service';
import { AuctionSyncService } from '../services/auction-sync/auction-sync.service';
import { AuctionService } from '../services/auction/auction.service';
import { OfferStatus } from '../services/auction/offer-status.enum';
import { AuthService } from '../services/auth/auth.service';
import AuctionUtils from '../utils/auction.utils';

@Component({
  selector: 'app-page-view-auction',
  templateUrl: './page-view-auction.component.html',
  styleUrls: ['./page-view-auction.component.css']
})
export class PageViewAuctionComponent {

  // The auction
  protected auction: Auction | undefined;

  // The seller's name
  protected sellerName: string = '';

  // The purchaser's name
  protected purchaserName: string = '';

  // The current bid
  protected currentBid: Offer | undefined;

  // The top bidder
  protected topBidderName: string = '';

  // Update timer
  private updateTimer: NodeJS.Timer | undefined;

  // The bidder
  protected bidderId: string = '';

  // Check if the viewer is the seller
  protected isSeller: boolean = false;

  // Control input for the bid amount
  protected bid = new FormControl('', [Validators.required, Validators.min(1), Validators.max(2000000)]);

  // Is the bid form submitted
  protected isBidSubmitted: boolean = false;

  // The bid error message
  protected bidErrorMessage: string = '';

  // Is the purchase form submitted
  protected isPurchaseSubmitted: boolean = false;

  // The purchase error message
  protected purchaseErrorMessage: string = '';

  // Construct the view auction component
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auctions: AuctionService,
    private sync: AuctionSyncService,
    private auth: AuthService,
    private accounts: AccountService
  ) { }

  // On init
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

          // Update the auction
          this.updateAuction(this.auction);

          // Get the seller's name
          this.accounts.getById(this.auction?.sellerId).subscribe(account => {
            // Set seller name if account is not null
            if (account !== null) {
              this.sellerName = account.name;
            }
          });

          // Check if the viewer id and check if they are the seller
          this.auth.getAccountId().subscribe(res => {
            this.bidderId = res || '';
            this.isSeller = res === this.auction?.sellerId;
          });

          // Update the auction every 5 seconds
          this.updateTimer = this.sync.updateAuction(this.auction, 5000, (auction) => {
            // Update the auction
            this.updateAuction(auction);
          });
        });
      }
    });
  }

  // On destroy
  ngOnDestroy(): void {
    // Clear the sync timer
    if (this.updateTimer) clearInterval(this.updateTimer);
  }

  // Called when the component syncs with the auction service
  private updateAuction(auction: Auction): void {
    // Update current bid
    this.currentBid = auction.bids.length > 0 ? auction.bids[auction.bids.length - 1] : undefined;

    // Update top bidder name
    if (this.currentBid !== undefined) {
      this.accounts.getById(this.currentBid.userId).subscribe(account => {
        // Set top bidder name if account is not null
        if (account !== null) {
          this.topBidderName = account.name;
        }
      });
    }

    // Update the purchaser name
    if (auction.purchase !== null) {
      this.accounts.getById(auction.purchase.userId).subscribe(account => {
        // Set purchaser name if account is not null
        if (account !== null) {
          this.purchaserName = account.name;
        }
      });
    }
  }

  // Check if the auction has been purchased
  protected isPurchased(): boolean {
    return AuctionUtils.isPurchased(this.auction);
  }

  // Check if the auction has expired
  protected isExpired(): boolean {
    return AuctionUtils.isExpired(this.auction);
  }

  // Check if the user can interact with the auction
  protected canInteract(): boolean {
    return this.auction !== undefined && !this.isExpired() && !this.isSeller && this.auction?.purchase === null;
  }

  // Called when a user tries to bid on an auction.
  protected onBid(): void {
    // Skip if the user cannot interact
    if (!this.canInteract()) return;

    // Set bid form to submitted
    this.isBidSubmitted = true;

    // Check validation
    if (!this.bid || this.bid.invalid) {
      return;
    }

    // Check if the bid is greater than the BIN price
    if (Number(this.bid.value) > (this.auction?.binPrice || 0)) {
      this.bidErrorMessage = 'The bid is greater than the BIN price.';
      return;
    }

    // The bid model
    let bidModel: Offer = {
      userId: this.bidderId,
      price: Number(this.bid.value) || 0,
      creationTimestamp: Date.now()
    };

    // Send the bid request to the backend
    this.auctions.createBid(this.auction?.id || '', bidModel).subscribe((status: OfferStatus) => {

      // Check the status of the request
      switch (status) {

        // If the bid was successful
        case OfferStatus.BID_SUCCESS:
          // Reset bid error message & form
          this.bidErrorMessage = '';
          this.isBidSubmitted = false;
          this.bid.reset();

          // Notify of success
          alert('Bid placed successfully!');
          break;

        // If the auction is already purchased
        case OfferStatus.ALREADY_PURCHASED:
          this.bidErrorMessage = 'The auction has already been purchased.';
          break;

        // If the auction expired
        case OfferStatus.EXPIRED:
          this.bidErrorMessage = 'The auction has expired.';
          break;

        // If the bid was too low
        case OfferStatus.TOO_LOW_OR_HIGH:
          this.bidErrorMessage = 'The bid is too low or too high. Please ensure the bid is greater than the current bid and less than the BIN price.';
          break;

        // Catch all error
        default:
          this.bidErrorMessage = 'There was an error placing the bid.';
          break;
      };

    });
  }

  // Called when a user tries to buy an auction.
  protected onBuy(): void {
    // Skip if the user cannot interact
    if (!this.canInteract()) return;

    // Set purchase form to submitted
    this.isPurchaseSubmitted = true;

    // Create the purchase offer
    let purchaseModel: Offer = {
      userId: this.bidderId,
      price: this.auction?.binPrice || 0,
      creationTimestamp: Date.now()
    };

    // Send the buy request to the backend
    this.auctions.purchase(this.auction?.id || '', purchaseModel).subscribe((status: OfferStatus) => {
      // Check the status of the request
      switch (status) {

        // If the bid was successful
        case OfferStatus.PURCHASE_SUCCESS:
          // Reset bid error message & form
          this.purchaseErrorMessage = '';
          this.isPurchaseSubmitted = false;
          this.bid.reset();

          // Notify of success
          alert('You have purchased the auction!');
          break;

        // If the auction is already purchased
        case OfferStatus.ALREADY_PURCHASED:
          this.purchaseErrorMessage = 'The auction has already been purchased.';
          break;

        // If the auction expired
        case OfferStatus.EXPIRED:
          this.purchaseErrorMessage = 'The auction has expired.';
          break;

        // If the bid was too low
        case OfferStatus.TOO_LOW_OR_HIGH:
          this.purchaseErrorMessage = 'The BIN price has updated. Please try again.';
          break;

        // Catch all error
        default:
          this.purchaseErrorMessage = 'There was an error purchasing the auction.';
          break;
      };
    });
  }

  // Called when a user tries to edit the auction
  protected onEdit(): void {
    // Navigate to the edit auction component
    this.router.navigate(['/market/edit', this.auction?.id]);
  }
}