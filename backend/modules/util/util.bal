import lotto.conf;
import lotto.dao;

import ballerina/jwt;
import ballerina/time;


public isolated function extractUser(string jwtAssertion) returns dao:User|error {
    jwt:ValidatorConfig validatorConfig = {
        issuer: conf:jwt.iss,
        audience: conf:jwt.aud,
        clockSkew: 60,
        // For detials, see https://lib.ballerina.io/ballerina/jwt/latest#ValidatorSignatureConfig.
        signatureConfig: {
            jwksConfig: {
                url: conf:jwt.jwksEndpoint,
                cacheConfig: { // doc - https://central.ballerina.io/ballerina/cache/latest#CacheConfig
                    capacity: conf:jwt.cacheCap,
                    evictionFactor: 0.25,
                    evictionPolicy: "LRU",
                    defaultMaxAge: conf:jwt.cacheMaxAge, // 
                    cleanupInterval: conf:jwt.cacheCleanupInterval //seconds
                }
            }
        }
    };
    jwt:Payload payload = check jwt:validate(jwtAssertion, validatorConfig);
    string email = <string>payload["email"];
    string fullName = <string>payload["name"];
    string sub = <string>payload.sub;
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

