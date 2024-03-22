import ballerina/time;

//This is a ticket which limits 4 numbers per ticket
public type TicketNumber 0|1|2|3|4|5|6|7|8|9; //TODO here we cannot take the range from a conf, hence may need to update manually

public type TicketNumbers [TicketNumber, TicketNumber, TicketNumber, TicketNumber];

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
    readonly time:Date drawDate;
    readonly string ticketId;
    float prizeWon;
    string description; //TODO may need to expand on this based on types of winnings, IE 3 out of 4, 2 out of 4 etc etc
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

public type ResWinner record {
    string drawDate;
    string ticketId;
    string userFullName;
    float prizeWon;
    string description; //TODO may need to expand on this based on types of winnings, IE 3 out of 4, 2 out of 4 etc etc
};



