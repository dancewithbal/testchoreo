import lotto.dao;

import ballerina/jwt;
import ballerina/time;
import ballerina/random;


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
    int n1 = check random:createIntInRange(1, 25);
    int n2 = check random:createIntInRange(1, 25);
    int n3 = check random:createIntInRange(1, 25);
    int n4 = check random:createIntInRange(1, 25);
    return [n1, n2, n3, n4];
}


