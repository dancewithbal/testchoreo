import lotto.dao;

isolated table<dao:User> key(userId) users = table [];

isolated table<dao:Ticket> key(ticketId) tickets = table [];

isolated table<dao:Draw> key(drawId) draws = table [];

isolated table<dao:Winner> key(winnerId) winners = table [];

public isolated function upsertUser(dao:User user) returns error? {
    lock {
        if users.hasKey(user.userId) {
            return;
        }
        users.add(user.clone());
    }
}

public isolated function upsertTicket(dao:Ticket ticket) returns error? {
    lock {
        if tickets.hasKey(ticket.ticketId) {
            return;
        }
        tickets.add(ticket.clone());
    }
}

public isolated function deleteTicket(string id) returns error? {
    lock {
        dao:Ticket? removeIfHasKey = tickets.removeIfHasKey(id);
        if removeIfHasKey is dao:Ticket {

        } else {

        }
    }

}

public isolated function getTickets() returns dao:ResTicket[] {
    lock {
        dao:ResTicket[] res = [];
        foreach dao:Ticket ticket in tickets {
            res.push({
                purchaseDate: ticket.purchaseDate[0],
                ticketNumbers: ticket.ticketNumbers,
                ticketId: ticket.ticketId
            });
        }
        return res.clone();
    }
}
