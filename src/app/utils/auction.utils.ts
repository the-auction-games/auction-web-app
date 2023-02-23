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
}