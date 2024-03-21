export interface UserState {
    loggedIn: boolean;
    id: string;
    givenName: string;
    familyName: string;
    fullName: string;
    email: string;
    picture: string;
}

export interface TicketState {
    ticketId: string;
    ticketNumbers: number[];
    purchaseDate: string;
    drawDate: string;
}