import { Injectable } from "@angular/core";
import Auction from "../../models/auction.model";

// Utility class for auctions
@Injectable({
    providedIn: 'root'
})
export class AuctionUtils {

    // Method to check if an auction has been purchased
    public isPurchased(auction?: Auction): boolean {
        // Check if the auction is undefined
        if (auction == undefined) return false;

        // Check if the auction has been purchased
        return auction.purchase != null;
    }

    // Method to check if a bidder won the auction
    public didBidderWin(auction?: Auction): boolean {
        // Check if the auction is undefined
        if (auction == undefined) return false;

        // Check if the auction has expired
        return this.isExpired(auction) && auction.bids.length > 0;
    }

    // Method to check if an auction has expired.
    public isExpired(auction?: Auction): boolean {
        // Check if the auction is undefined
        if (auction === undefined) return true;

        // Check if the auction has expired
        return auction.expirationTimestamp < Date.now();
    }

    // Get the current bid of an auction, default to start bid if no bids
    public getCurrentBid(auction?: Auction): number {
        // Check if the auction is undefined
        if (auction === undefined) return 0;

        // Check if the auction has been purchased
        if (this.isPurchased(auction)) {
            return auction.purchase!.price;
        }

        // Check if the auction has bids
        if (auction.bids.length > 0) {
            return auction.bids[auction.bids.length - 1].price;
        }

        // Return the start bid
        return auction.startBid;
    }

    // Format the expiration date
    public getFormattedExpiration(auction?: Auction): string {
        // Return '...' if the expiration isloading
        if (auction === undefined) {
            return '...';
        }

        // Get the time difference
        let expiration = auction.expirationTimestamp;
        let now = new Date().getTime();
        let diff = expiration - now;

        // Check if the auction has expired
        if (diff < 0) {
            return 'Expired';
        }

        // Get the days
        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);

        // Get the hours
        let hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);

        // Get the minutes
        let minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * (1000 * 60);

        // Get the seconds
        let seconds = Math.floor(diff / (1000));
        diff -= seconds * (1000);

        // Return the formatted expiration
        return days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
    }
}