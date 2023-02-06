// A model for handling authentication sessions
export interface Session {
    id: string,
    accountId: string,
    creationTimestamp: number,
    expirationTimestamp: number
}