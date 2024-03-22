import lotto.conf;
import lotto.dao;

import ballerina/jwt;
import ballerina/random;
import ballerina/time;

public isolated function extractUser(string jwtAssertion) returns dao:User|error {
    [jwt:Header, jwt:Payload] response = check jwt:decode(jwtAssertion);
    string email = <string>response[1]["email"];
    string fullName = <string>response[1]["name"];
    string sub = <string>response[1].sub;
    dao:User user = {
        balance: 1000,
        updatedAt: time:utcToCivil(time:utcNow()),
        userId: sub,
        fullName: fullName,
        createdAt: time:utcToCivil(time:utcNow()),
        email: email
    };
    return user;
}

public isolated function generateNumbers() returns dao:TicketNumbers|error {
    int n1 = check random:createIntInRange(conf:ticketConf.startNumber, conf:ticketConf.endNumber);
    int n2 = check random:createIntInRange(conf:ticketConf.startNumber, conf:ticketConf.endNumber);
    int n3 = check random:createIntInRange(conf:ticketConf.startNumber, conf:ticketConf.endNumber);
    int n4 = check random:createIntInRange(conf:ticketConf.startNumber, conf:ticketConf.endNumber);
    if n1 is dao:TicketNumber && n2 is dao:TicketNumber && n3 is dao:TicketNumber && n4 is dao:TicketNumber {
        return [n1, n2, n3, n4];
    }
    return error("Failed to generate random numbers");
    // return [0, 0, 0, 0]; // TODO remove this, this is for debugging
}

