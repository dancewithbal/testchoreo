export interface GenResp {
    status: number;
    message: string;
};

export interface ReqTicket {
    readonly numbers: number[];
    readonly drawDate: string;
}

export interface ResTicket {
    ticketId: string;
    ticketNumbers: number[];
    purchaseDate: string;
    drawDate: string
}

export interface ResDraw {
    drawDate: string;
    winningNumbers: number[];
}

export interface ResWinner {
    drawDate: string;
    ticketId: string;
    userFullName: string;
    prizeWon: number;
    description: string;
}