import ballerina/time;

//This is a ticket which limits 4 numbers per ticket
public type TicketNumbers [int, int, int, int];

public type User record {
    readonly string userId;
    string fullName;
    string email;
    float balance;
    time:Civil createdAt;
    time:Civil updatedAt;
};

public type Ticket record {
    readonly string ticketId;
    string userId;
    TicketNumbers ticketNumbers;
    time:Civil purchaseDate;
    time:Date drawDate;
};

public type Draw record {
    readonly time:Date drawDate;
    TicketNumbers winningNumbers;
};

public type Winner record {
    readonly string winnerId;
    string drawId;
    string userId;
    float prizeWon;
};

// Requests responses
public type ResGeneric record {
    int status;
    string message;
};

public type ResGenericError record {
    string code;
    string detail;
};

// public type RpGenericError error<RpGeneric>;

public type ReqTicket record {
    TicketNumbers numbers;
    string drawDate;
};

public type ResTicket record {
    string ticketId;
    TicketNumbers ticketNumbers;
    string purchaseDate;
    string drawDate;
};

public type ResDraw record {
    string drawDate;
    TicketNumbers winningNumbers;
};



