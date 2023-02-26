import Auction from "../models/auction.model";

// Utility class for auctions
export default class AuctionUtils {

    // Method to check if an auction has been purchased
    public static isPurchased(auction?: Auction): boolean {
        // Check if the auction is undefined
        if (auction === undefined) return false;

        // Check if the auction has been purchased
        return auction.purchase !== null;
    }

    // Method to check if an auction has expired.
    public static isExpired(auction?: Auction): boolean {
        // Check if the auction is undefined
        if (auction === undefined) return true;

        // Check if the auction has expired
        return auction.expirationTimestamp < Date.now();
    }

    // Format the expiration date
    public static getFormattedExpiration(auction?: Auction): string {
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