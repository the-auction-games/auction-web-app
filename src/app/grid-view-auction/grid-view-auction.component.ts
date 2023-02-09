import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { timeout } from 'rxjs';
import Auction from '../models/auction.model';
import { AuctionSyncService } from '../services/auction-sync/auction-sync.service';
import { AuctionService } from '../services/auction/auction.service';

@Component({
  selector: 'grid-view-auction',
  templateUrl: './grid-view-auction.component.html',
  styleUrls: ['./grid-view-auction.component.css']
})
export class GridViewAuctionComponent {

  // The auction
  @Input() auction: Auction | undefined;

  // Construct the grid view auction component
  constructor(
    private router: Router,
    private sync: AuctionSyncService
  ) { }

  // Method called when the user clicks on the auction
  public onView(): void {
    
    // Log the auction id
    console.log('Viewing auction: ' + this.auction?.id);

    // Navigate to the market page with the auction id as a parameter
    this.router.navigate(['/market', this.auction?.id]);
  }
}
