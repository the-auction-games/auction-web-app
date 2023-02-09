import { Component, Input, TRANSLATIONS } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Auction from '../models/auction.model';
import { AccountService } from '../services/account/account.service';
import { AuctionService } from '../services/auction/auction.service';
import { AuthService } from '../services/auth/auth.service';

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
  protected bid = new FormControl('', [Validators.required, Validators.min(1), Validators.max(2000000)]);

  // Is the bid form submitted
  protected isSubmitted: boolean = false;

  // The seller's name
  protected sellerName: string = '';

  // Construct the view auction component
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auctions: AuctionService,
    private auth: AuthService,
    private accounts: AccountService
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

          // Get the seller's name
          this.accounts.getById(this.auction?.sellerId).subscribe(account => {
            // Set seller name if account is not null
            if (account !== null) {
              this.sellerName = account.name;
            }
          });

          // Check if the viewer is the seller
          this.auth.getAccountId().subscribe(res => {
            this.isSeller = res === this.auction?.sellerId;
          });

        });
      }
    });
  }

  // Called when a user tries to bid on an auction.
  protected onBid(): void {

    // Set bid form to submitted
    this.isSubmitted = true;

    // Check validation
    if (this.bid.invalid) {
      return;
    }

    // Check if the bid is empty
    console.log('Received bid of ' + this.bid.value + ' from user');
  }

  // Called when a user tries to buy an auction.
  protected onBuy(): void {
  }

  // Called when a user tries to edit the auction
  protected onEdit(): void {
    // Navigate to the edit auction component
    this.router.navigate(['/market/edit', this.auction?.id]);
  }
}
