import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import Auction from '../models/auction.model';

@Component({
  selector: 'grid-view-auction',
  templateUrl: './grid-view-auction.component.html',
  styleUrls: ['./grid-view-auction.component.css']
})
export class GridViewAuctionComponent {

  // The auction
  @Input() auction: Auction | undefined;

  constructor(private router: Router) {}

  // Method called when the user clicks on the auction
  public onView(): void {

    console.log('View auction: ' + this.auction?.id);

    // Navigate to the market page with the auction id as a parameter
    this.router.navigate(['/market', this.auction?.id]);
  }
}
