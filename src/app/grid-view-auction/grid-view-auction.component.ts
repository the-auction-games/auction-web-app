import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { timeout } from 'rxjs';
import Auction from '../models/auction.model';
import { AuctionSyncService } from '../services/auction-sync/auction-sync.service';
import { AuctionService } from '../services/auction/auction.service';
import AuctionUtils from '../utils/auction.utils';

@Component({
  selector: 'grid-view-auction',
  templateUrl: './grid-view-auction.component.html',
  styleUrls: ['./grid-view-auction.component.css']
})
export class GridViewAuctionComponent {

  // The auction
  @Input() auction: Auction | undefined;

  // Is the auction a demo
  @Input() isDemo: boolean = false;

  // The current bid
  protected currentBid: number = 0;

  // The auction refresh interval
  private auctionRefreshInterval: NodeJS.Timer | undefined;

  // Countdown interval timer
  private countdownInterval: NodeJS.Timer | undefined;

  // The formatted expiration
  protected expiration: string | undefined = undefined;

  // Construct the grid view auction component
  constructor(
    private router: Router,
    private sync: AuctionSyncService
  ) { }

  // Method called when the component is initialized
  ngOnInit(): void {
    // Get the current bid
    this.currentBid = AuctionUtils.getCurrentBid(this.auction);

    // Refresh the auction every 5 seconds
    if (!this.isDemo) {
      this.auctionRefreshInterval = this.sync.updateAuction(this.auction, 5000, (auction) => {
        // Update current bid
        this.currentBid = AuctionUtils.getCurrentBid(auction);
      });
    }

    // Get the formatted expiration
    this.expiration = AuctionUtils.getFormattedExpiration(this.auction);

    // Refresh the countdown every second
    this.countdownInterval = setInterval(() => {
      this.expiration = AuctionUtils.getFormattedExpiration(this.auction);
    }, 1000)
  }

  // Method called when the component is destroyed
  ngOnDestroy(): void {
    // Clear intervals
    if (!this.isDemo) clearInterval(this.auctionRefreshInterval);
    clearInterval(this.countdownInterval);
  }

  // Method called when the user clicks on the auction
  public onView(): void {

    // Check if a demo
    if (this.isDemo) {
      // Navigate to the market
      this.router.navigate(['/market']);

    } else {
      // Log the auction id
      console.log('Viewing auction: ' + this.auction?.id);

      // Navigate to the market page with the auction id as a parameter
      this.router.navigate(['/market', this.auction?.id]);
    }
  }
}
