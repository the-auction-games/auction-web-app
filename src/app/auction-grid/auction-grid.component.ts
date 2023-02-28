import { Component, Input } from '@angular/core';
import Auction from '../models/auction.model';

@Component({
  selector: 'auction-grid',
  templateUrl: './auction-grid.component.html',
  styleUrls: ['./auction-grid.component.css']
})
export class AuctionGridComponent {

  // Get auctions
  @Input() auctions: Auction[] = [];

  // The constructor
  constructor() { }

}
