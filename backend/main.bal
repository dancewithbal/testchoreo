import ballerina/http;
import ballerina/log;
import ballerina/io;

import lotto.conf;


// The service-level CORS config applies globally to each `resource`.
@http:ServiceConfig {
    cors: {
        allowOrigins: conf:cors.allowOrigins
        // allowMethods: ["GET", "POST"],
        // allowCredentials: true
        // allowHeaders: ["*"],
        // exposeHeaders: ["*"],
        // maxAge: 84900
    }
}
service /backend on new http:Listener(8090) {
    // resource function post test1(@http:Payload string textMsg) returns string {
    //     return "hello" + textMsg;
    // }

    @http:ResourceConfig {
        cors: {
            allowCredentials: true
        }
    }
    resource function get results(http:Headers headers) returns json|error {
        foreach var item in headers.getHeaderNames() {
            io:println(item + ": " + (check headers.getHeader(item)));
        }
        json result = [
            {
                date: "03/02/2023",
                numbers: [5, 9, 5, 3],
                winners: 4
            },
            {
                date: "04/02/2023",
                numbers: [9, 7, 2, 2],
                winners: 5
            },
            {
                date: "05/02/2023",
                numbers: [7, 2, 9, 4],
                winners: 5
            }
        ];
        return result;
    }

    resource function get login(@http:Query string code) returns string {
        log:printDebug("Login request received");
        return "hello" + code;
    }
}
