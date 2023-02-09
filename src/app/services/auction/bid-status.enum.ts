// The bid status enum.
// Helps clarify the response from the auction service.
export enum BidStatus {
    Created = 201,
    NotFound = 404,
    Expired = 406,
    TooLow = 409,
    Error = 500
  };