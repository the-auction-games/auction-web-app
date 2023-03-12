import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, of, switchMap } from 'rxjs';
import { Account } from '../models/account.model';
import { Activity } from '../models/activity.model';
import Auction from '../models/auction.model';
import { AccountService } from '../services/account/account.service';
import { ActivityService } from '../services/activity/activity.service';
import { AuctionService } from '../services/auction/auction.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {

  // The account
  protected account: Account | undefined = undefined;

  // Seller auctions
  protected sellerAuctions: Auction[] = [];

  // Purchased auctions
  protected purchasedAuctions: Auction[] = [];

  // User related activity
  protected activity: Activity[] = [];

  // The constructor
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private accounts: AccountService,
    private activityService: ActivityService,
    private auctionsService: AuctionService
  ) { }

  // Called on init
  ngOnInit() {

    // Get account id, first check params, then check cookies
    this.route.paramMap.subscribe(params => {

      // Create observable for the id
      let observableId: Observable<string | null>;

      // Get account id from params or cookies
      let accountId = params.get('accountId');
      if (accountId) {
        observableId = of(accountId);
      } else {
        observableId = this.auth.getAccountId();
      }

      // Load account from database
      observableId.pipe(switchMap(id => this.accounts.getById(id || '')))
        .subscribe(account => {

          // Set account
          this.account = account || undefined;

          // Load auctions
          this.auctionsService.getAll().subscribe(auctions => {
            // Get seller auctions
            this.sellerAuctions = auctions.filter(auction => auction.sellerId == account?.id);

            // Get purchased / top bid & expired auctions
            this.purchasedAuctions = auctions.filter(auction => {
              // Check if purchased
              let isPurchased = auction.purchase?.userId == account?.id;

              // Check if expired
              let isExpired = auction.expirationTimestamp < new Date().getTime();

              // Check if the account is the top bidder
              let isTopBid = isExpired && auction.bids.length > 0 && auction.bids[auction.bids.length - 1].userId == account?.id;

              // Return true if purchased or top bid
              return isPurchased || isTopBid;
            });
          });

          // Load activity
          this.activityService.getForUser(account?.id || '').subscribe(activity => {
            this.activity = activity;
          });
        });
    });
  }
}
