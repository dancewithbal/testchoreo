import lotto.dao;
import lotto.db;
import lotto.err;
import lotto.util;

import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerina/uuid;
import ballerina/io;

// This is not applicable for the choreo deployment
@http:ServiceConfig {
    cors: {
        allowOrigins: ["https://localhost:3000"],
        allowCredentials: true
    }
}
service /backend on new http:Listener(8090) {

    isolated resource function post tickets(@http:Header string x\-jwt\-assertion,
            @http:Payload dao:ReqTicket ticket) returns dao:ResTicket|http:Unauthorized|http:InternalServerError {
        io:println("============= hit post ticket request " + x\-jwt\-assertion + " ===");
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

        dao:Ticket data = {
            purchaseDate: time:utcNow(),
            ticketNumbers: ticket.numbers,
            userId: user.userId,
            ticketId: uuid:createType1AsString()
        };
        res = db:upsertTicket(data);
        if res is error {
            log:printError("Failed to upsert ticket", res);
            return err:createInternaServerError(err:FAILED_TO_UPSERT_TICKET, "Failed to upsert ticket");
        }

        dao:ResTicket re = {
            ticketId: data.ticketId,
            ticketNumbers: data.ticketNumbers,
            purchaseDate: data.purchaseDate[0]
        };
        return re;
    }

    isolated resource function delete tickets/[string id]() returns dao:ResGeneric|http:InternalServerError {
        error? res = db:deleteTicket(id);
        if  res is error {
            log:printError("Failed to delete ticket", res);
            return err:createInternaServerError(err:FAILED_TO_DELETE_TICKET, "Failed to delete the ticket");
        }
        return {
            status: 200,
            message: "Successfully deleted"
        };
    }

    isolated resource function get tickets(http:Headers headers) returns dao:ResTicket[] {
        return db:getTickets();
    }

    resource function get login(@http:Query string code) returns string {
        log:printDebug("Login request received");
        return "hello" + code;
    }
}
