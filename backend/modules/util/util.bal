import lotto.dao;

import ballerina/jwt;
import ballerina/time;


public isolated function extractUser(string jwtAssertion) returns dao:User|error {
    [jwt:Header, jwt:Payload] response = check jwt:decode(jwtAssertion);
    string email = <string>response[1]["email"];
    string fullName = <string>response[1]["name"];
    string sub = <string>response[1].sub;
    dao:User user = {
        balance: 1000,
        updatedAt: time:utcNow(),
        userId: sub,
        fullName: fullName,
        createdAt: time:utcNow(),
        email: email
    };
    return user;
}

