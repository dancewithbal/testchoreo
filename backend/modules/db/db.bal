import lotto.dao;
import ballerina/log;
import lotto.util;

isolated table<dao:User> key(userId) users = table [];

isolated table<dao:Ticket> key(ticketId) tickets = table [];

isolated table<dao:Draw> key(drawDate) draws = table [];

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

public isolated function deleteTicket(string userId, string id) returns error? {
    lock {
        dao:Ticket ticket = tickets.get(id);
        if ticket.userId !== userId {
            string msg = string `Trying to delete a ticket which does not belong to the user, userId: ${userId}, ticketId: ${id}`;
            log:printDebug(msg);
            return error(msg);
        }
        dao:Ticket? removeIfHasKey = tickets.removeIfHasKey(id);
        if removeIfHasKey is dao:Ticket {

        } else {

        }
    }

}

public isolated function getTickets(string userId) returns dao:ResTicket[] {
    lock {
        dao:ResTicket[] res = [];
        foreach dao:Ticket ticket in tickets {
            if ticket.userId !== userId {
                continue;
            }
            res.push({
                purchaseDate: util:civilToIso8601(ticket.purchaseDate),
                ticketNumbers: ticket.ticketNumbers,
                ticketId: ticket.ticketId,
                drawDate: util:dateToBasicString(ticket.drawDate)
            });
        }
        return res.clone();
    }
}

public isolated function upsertDraw(dao:Draw draw) returns error? {
    lock {
        if draws.hasKey(draw.drawDate) {
            return;
        }
        draws.add(draw.clone());
    }
}

public isolated function getDraws() returns dao:ResDraw[] {
    lock {
        dao:ResDraw[] res = [];
        foreach dao:Draw draw in draws {
            res.push({
                drawDate: util:dateToBasicString(draw.drawDate),
                winningNumbers: draw.winningNumbers
            });
        }
        return res.clone();
    }
}
