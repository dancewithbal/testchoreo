import lotto.dao;
import lotto.util;

import ballerina/log;
import ballerina/time;

isolated table<dao:User> key(userId) users = table [];

isolated table<dao:Ticket> key(ticketId) tickets = table [];

isolated table<dao:Draw> key(drawDate) draws = table [];

isolated table<dao:Winner> key(drawDate, ticketId) winners = table [];

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
            return error("Ticket id already exist");
        }
        table<dao:Ticket> existing = from dao:Ticket t in tickets
            where t.ticketNumbers == ticket.ticketNumbers && t.drawDate == ticket.drawDate
            select t;
        if existing.length() > 0 {
            return error("Ticket with same numbers exist for same draw date");
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
        if removeIfHasKey is () {
            return error(string `Ticket with id: ${id} does not exist`);
        }
    }

}

public isolated function getTickets(string userId, string? drawDate) returns dao:ResTicket[]|error {
    time:Date? dDate = ();
    if drawDate is string {
        dDate = check util:dateFromBasicString(drawDate);
    }
    lock {
        dao:ResTicket[] res = [];
        foreach dao:Ticket ticket in tickets {
            if ticket.userId !== userId {
                continue;
            }
            if dDate is time:Date && ticket.drawDate != dDate {
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
            return error("Draw already exist for the given day");
        }
        draws.add(draw.clone());
    }
}

public isolated function updateWinners(dao:Draw draw) returns error? {
    table<dao:Ticket> ticketsCopy;
    lock {
        ticketsCopy = tickets.clone();
    }
    table<dao:Ticket> drawWinners = from dao:Ticket t in ticketsCopy
        where t.drawDate == draw.drawDate && t.ticketNumbers == draw.winningNumbers
        select t;
    foreach dao:Ticket t in drawWinners {
        lock {
            winners.add({
                drawDate: draw.drawDate,
                ticketId: t.ticketId,
                prizeWon: 1000.0,
                description: "4 out of 4 numbers match"
            });
        }
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

public isolated function getWinners(string? drawDate) returns dao:ResWinner[]|error {
    table<dao:Winner> cWinners;
    lock {
        cWinners = winners.clone();
    }
    table<dao:Ticket> cTickets;
    lock {
        cTickets = tickets.clone();
    }
    table<dao:User> cUsers;
    lock {
        cUsers = users.clone();
    }
    if drawDate is null {
        return getWinnersWithoutDrawDate(cWinners, cTickets, cUsers);
    }
    time:Date dDate = check util:dateFromBasicString(drawDate);
    return getWinnersWithDrawDate(dDate, cWinners, cTickets, cUsers);
}

isolated function getWinnersWithDrawDate(time:Date drawDate, table<dao:Winner> winners, table<dao:Ticket> tickets, table<dao:User> users) returns dao:ResWinner[] {
    table<dao:ResWinner> res = from dao:Winner w in winners
        join dao:Ticket t in tickets on w.ticketId equals t.ticketId
        join dao:User u in users on t.userId equals u.userId
        where w.drawDate == drawDate
        select {
            drawDate: util:dateToBasicString(w.drawDate),
            ticketId: w.ticketId,
            prizeWon: w.prizeWon,
            description: w.description,
            userFullName: u.fullName
        };

    return res.toArray();
}

isolated function getWinnersWithoutDrawDate(table<dao:Winner> winners, table<dao:Ticket> tickets, table<dao:User> users) returns dao:ResWinner[] {
    table<dao:ResWinner> res = from dao:Winner w in winners
        join dao:Ticket t in tickets on w.ticketId equals t.ticketId
        join dao:User u in users on t.userId equals u.userId
        select {
            drawDate: util:dateToBasicString(w.drawDate),
            ticketId: w.ticketId,
            prizeWon: w.prizeWon,
            description: w.description,
            userFullName: u.fullName
        };

    return res.toArray();
}
