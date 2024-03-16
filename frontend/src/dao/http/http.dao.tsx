export interface GenResp {
    status: number;
    message: string;
};

export interface ReqTicket {
    readonly numbers: number[];
}

export interface ResTicket {
    ticketId: string;
    ticketNumbers: number[];
    purchaseDate: Date;
}