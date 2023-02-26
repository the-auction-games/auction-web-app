import { Component } from '@angular/core';
import Auction from '../models/auction.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // The demo auction
  protected demoAuction: Auction = {
    id: '-',
    sellerId: '-',
    title: 'Demo Auction',
    description: 'This is a demo auction.',
    startBid: 100,
    bids: [
      {
        userId: '-',
        price: 100,
        creationTimestamp: -1
      },
      {
        userId: '-',
        price: 200,
        creationTimestamp: -1
      },
      {
        userId: '-',
        price: 300,
        creationTimestamp: -1
      },
      {
        userId: '-',
        price: 350,
        creationTimestamp: -1
      }
    ],
    binPrice: 2000,
    purchase: null,
    base64Image: "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",
    creationTimestamp: -1,
    expirationTimestamp: new Date().getTime() + 1000 * 60 * 60 * 24 * 7
  }

  // The home component constructor
  constructor() { }

  // The home component on init
  ngOnInit(): void {
  }
}
