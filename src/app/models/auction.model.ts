import Offer from "./offer.model";

// The auction model
export default interface Auction {
    id: string,
    sellerId: string,
    title: string,
    description: string,
    startBid: number,
    bids: Offer[],
    binPrice: number,
    purchase: Offer | null,
    base64Image: string,
    creationTimestamp: number,
    expirationTimestamp: number
}