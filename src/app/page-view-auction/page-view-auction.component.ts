import { Component, Input, TRANSLATIONS } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import Auction from '../models/auction.model';
import Offer from '../models/offer.model';
import { AccountService } from '../services/account/account.service';
import { ActivityType } from '../services/activity/activity-type.enum';
import { ActivityService } from '../services/activity/activity.service';
import { AuctionSyncService } from '../services/auction-sync/auction-sync.service';
import { AuctionService } from '../services/auction/auction.service';
import { OfferStatus } from '../services/auction/offer-status.enum';
import { AuthService } from '../services/auth/auth.service';
import { ActivityUtils } from '../services/utils/activity.utils';
import { AuctionUtils } from '../services/utils/auction.utils';

@Component({
  selector: 'app-page-view-auction',
  templateUrl: './page-view-auction.component.html',
  styleUrls: ['./page-view-auction.component.css']
})
export class PageViewAuctionComponent {

  // The auction
  protected auction: Auction | undefined = undefined;

  // The seller's name
  protected sellerName: string = '';

  // The purchaser's name
  protected purchaserName: string = '';

  // The current bid
  protected currentBid: Offer | undefined = undefined;

  // The top bidder
  protected topBidderName: string = '';

  // Update timer
  private updateTimer: NodeJS.Timer | undefined = undefined;

  // Expiration timer
  private expirationTimer: NodeJS.Timer | undefined = undefined;

  // The formatted expiration
  protected formattedExpiration: string = '';

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
    private accounts: AccountService,
    private auctionUtils: AuctionUtils,
    private activities: ActivityService,
    private activityUtils: ActivityUtils
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
          this.updateTimer = this.sync.updateAuction(this.auction, 5000, this.updateAuction.bind(this));

          // Update formatted expiration
          this.formattedExpiration = this.auctionUtils.getFormattedExpiration(this.auction);

          // Update expiration timer
          this.expirationTimer = setInterval(() => {
            // Update formatted expiration
            this.formattedExpiration = this.auctionUtils.getFormattedExpiration(this.auction);
          }, 1000);
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
    // Update top bidder name
    if (auction.bids.length > 0) {

      // Set the current bid
      this.currentBid = auction.bids[auction.bids.length - 1];

      // Get the top bidder's name
      this.accounts.getById(this.currentBid.userId).subscribe(account => {
        // Set top bidder name if account is not null
        if (account !== null) {
          this.topBidderName = account.name;
        }
      });
    }

    // Update the purchaser name
    if (auction.purchase != null) {
      this.accounts.getById(auction.purchase.userId).subscribe(account => {
        // Set purchaser name if account is not null
        if (account != null) {
          this.purchaserName = account.name;
        }
      });
    }
  }

  // Check if the auction has been purchased
  protected isPurchased(): boolean {
    return this.auctionUtils.isPurchased(this.auction);
  }

  // Check if the auction has expired
  protected isExpired(): boolean {
    return this.auctionUtils.isExpired(this.auction);
  }

  // Check if the user can interact with the auction
  protected canInteract(): boolean {
    return this.auction != undefined && !this.isExpired() && !this.isSeller && this.auction?.purchase === null;
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
          // Get the bid price
          let bidPrice = Number(this.bid.value) || 0;

          // Reset bid error message & form
          this.bidErrorMessage = '';
          this.isBidSubmitted = false;
          this.bid.reset();

          // Create activity for the new bid
          this.auth.getAccountId().pipe(
            switchMap(accountId => this.activityUtils.createActivityModel(accountId || '', ActivityType.CREATE_BID, this.auction)),
          ).subscribe(activity => {
            // Create the activity
            this.activities.create(activity).subscribe((success) => { });
          });

          // Notify of success
          document.getElementById('bid-success')?.toggleAttribute('hidden');
          setTimeout(() => {
            document.getElementById('bid-success')?.toggleAttribute('hidden');
          }, 5000);
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

          // Create activity for the new purchase
          this.auth.getAccountId().pipe(
            switchMap(accountId => this.activityUtils.createActivityModel(accountId || '', ActivityType.PURCHASE_AUCTION, this.auction)),
          ).subscribe(activity => {
            // Create the activity
            this.activities.create(activity).subscribe((success) => { });
          });

          // Notify of success
          document.getElementById('purchase-success')?.toggleAttribute('hidden');

          // 5s later refresh the entire page
          setTimeout(() => {
            window.location.reload();
          }, 5000);

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

  // Called when a user zooms in on the auction image
  protected onZoomToggle(): void {

    console.log('zoom toggle');

    // Toggle hidden on element by id zoomed-in
    let zoomedIn = document.getElementById('zoomed-in');

    if (zoomedIn) {
      // toggle hidden attribute
      if (zoomedIn.hasAttribute('hidden')) {
        zoomedIn.removeAttribute('hidden');
      } else {
        zoomedIn.setAttribute('hidden', 'true');
      }

    }
  }
}
