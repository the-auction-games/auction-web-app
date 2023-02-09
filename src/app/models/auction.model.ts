import Bid from "./bid.model";

// The auction model
export default interface Auction {
    id: string,
    sellerId: string,
    title: string,
    description: string,
    startBid: number,
    bids: Bid[],
    binPrice: number,
    base64Image: string,
    creationTimestamp: number,
    expirationTimestamp: number
}