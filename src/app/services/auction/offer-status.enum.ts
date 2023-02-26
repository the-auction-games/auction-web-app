// The bid status enum.
// Helps clarify the response from the auction service.
export enum OfferStatus {
  BID_SUCCESS = 201,
  PURCHASE_SUCCESS = 204,
  ALREADY_PURCHASED = 400,
  NOT_FOUND = 404,
  EXPIRED = 406,
  TOO_LOW_OR_HIGH = 409,
  ERROR = 500,
};