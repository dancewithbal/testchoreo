import lotto.dao;
import lotto.db;
import lotto.err;
import lotto.util;

import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/time;
import ballerina/uuid;

// This is not applicable for the choreo deployment
@http:ServiceConfig {
    cors: {
        allowOrigins: ["https://localhost:3000"],
        allowCredentials: true
    }
}
service /backend on new http:Listener(8090) {

    isolated resource function post tickets(@http:Header string x\-jwt\-assertion,
            @http:Payload dao:ReqTicket ticket) returns dao:ResTicket|http:Unauthorized|http:BadRequest|http:InternalServerError {
        dao:User|error user = util:extractUser(x\-jwt\-assertion);
        if user is error {
            io:println(user);
            log:printError("Failed to extract the user", user);
            return err:createUnauthorizedError(err:FAILED_TO_EXTRACT_USER, "Failed to extract user from the assertion");
        }

        error? res = db:upsertUser(user);
        if (res is error) {
            log:printError("Failed to upsert user", res);
            return err:createInternaServerError(err:FAILED_TO_UPSERT_USER, "Failed to upsert user");
        }

        time:Date|error drawDate = util:dateFromBasicString(ticket.drawDate);
        if drawDate is error {
            log:printError("Failed to parse draw date", res);
            return err:createInternaServerError(err:FAILED_TO_PARSE_DRAW_DATE, "Failed to parse draw date");
        }

        // Since draws are happening at 9pm, tickets cannot be bought after 8pm each day
        time:Civil now = time:utcToCivil(time:utcNow());
        time:Date today = {month: now.month, year: now.year, day: now.day};
        if today == drawDate && now.hour > 20 { //If buying a ticket for today draw, need to buy before 8pm (20hour)
            log:printError("Failed to parse draw date", res);
            return err:createBadRequest(err:TICKET_BUYING_TIME_EXCEEDED, "Failed to parse draw date");
        }

        dao:Ticket data = {
            purchaseDate: time:utcToCivil(time:utcNow()),
            ticketNumbers: ticket.numbers,
            userId: user.userId,
            ticketId: uuid:createType1AsString(),
            drawDate: drawDate
        };
        res = db:upsertTicket(data);
        if res is error {
            log:printError("Failed to upsert ticket", res);
            return err:createInternaServerError(err:FAILED_TO_UPSERT_TICKET, "Failed to upsert ticket");
        }

        dao:ResTicket re = {
            ticketId: data.ticketId,
            ticketNumbers: data.ticketNumbers,
            purchaseDate: util:civilToIso8601(data.purchaseDate),
            drawDate: util:dateToBasicString(data.drawDate)
        };
        return re;
    }

    isolated resource function delete tickets/[string id](@http:Header string x\-jwt\-assertion)
            returns dao:ResGeneric|http:Unauthorized|http:InternalServerError {
        dao:User|error user = util:extractUser(x\-jwt\-assertion);
        if user is error {
            io:println(user);
            log:printError("Failed to extract the user", user);
            return err:createUnauthorizedError(err:FAILED_TO_EXTRACT_USER, "Failed to extract user from the assertion");
        }
        error? res = db:deleteTicket(user.userId, id);
        if res is error {
            log:printError("Failed to delete ticket", res);
            return err:createInternaServerError(err:FAILED_TO_DELETE_TICKET, "Failed to delete the ticket");
        }
        return {
            status: 200,
            message: "Successfully deleted"
        };
    }

    isolated resource function get tickets(@http:Header string x\-jwt\-assertion, @http:Query string? drawDate) returns dao:ResTicket[]|http:Unauthorized|http:InternalServerError {
        dao:User|error user = util:extractUser(x\-jwt\-assertion);
        if user is error {
            io:println(user);
            log:printError("Failed to extract the user", user);
            return err:createUnauthorizedError(err:FAILED_TO_EXTRACT_USER, "Failed to extract user from the assertion");
        }
        dao:ResTicket[]|error res = db:getTickets(user.userId, drawDate);
        if res is error {
            log:printError("Failed to get tickets", res);
            return err:createInternaServerError(err:FAILED_TO_GET_TICKETS, "Failed to get tickets");
        }
        return res;
    }

    isolated resource function get draws() returns dao:ResDraw[] {
        return db:getDraws();
    }

    isolated resource function post draw() returns dao:ResGeneric|http:InternalServerError {
        io:println("===========hit draw trigger =============");
        log:printInfo("===========Hit draw trigger =============");
        // TODO add some client id validation for extra security
        dao:TicketNumbers|error numbers = util:generateNumbers();
        if numbers is error {
            log:printError("Failed to run the Draw", numbers);
            return err:createInternaServerError(err:FAILED_TO_RUN_THE_DRAW, "Failed to run the Draw");
        }

        time:Civil val = time:utcToCivil(time:utcNow());
        dao:Draw data = {
            drawDate: {month: val.month, year: val.year, day: val.day},
            winningNumbers: numbers
        };
        error? res = db:upsertDraw(data);
        if res is error {
            log:printError("Failed to insert the Draw", res);
            return err:createInternaServerError(err:FAILED_TO_RUN_THE_DRAW, "Failed to insert the Draw");
        }

        res = db:updateWinners(data);
        if res is error {
            log:printError("Failed to update the winners", res);
            return err:createInternaServerError(err:FAILED_TO_RUN_THE_DRAW, "Failed to update the winners");
        }

        dao:ResGeneric drawRes = {
            status: http:STATUS_OK,
            message: "Successfully ran the draw"
        };
        return drawRes;
    }

    isolated resource function get winner(@http:Query string? drawDate) returns dao:ResWinner[]|http:InternalServerError {
        dao:ResWinner[]|error res = db:getWinners(drawDate);
        if res is error {
            log:printError("Failed to get winners", res);
            return err:createInternaServerError(err:FAILED_TO_GET_WINNERS, "Failed to get winners");
        }
        return res;
    }

    // resource function get login(@http:Query string code) returns string {
    //     log:printDebug("Login request received");
    //     return "hello" + code;
    // }
}
