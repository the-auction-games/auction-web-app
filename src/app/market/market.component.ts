import { Component } from '@angular/core';
import Auction from '../models/auction.model';
import { AuctionService } from '../services/auction/auction.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent {

  // All auctions in the market
  protected allAuctions: Auction[] = [];

  // Construct the market with the auction service
  constructor(private auctions: AuctionService) { }

  // Initialize the market
  ngOnInit(): void {
    // Load all auctions on init
    this.auctions.getAll().subscribe(auctions => this.allAuctions = auctions);
  }
}
