import ballerina/http;
import ballerina/io;

public configurable Oauth2Config oauth2Conf = ?;
public configurable string backendUrl = ?;

public type Oauth2Config record {|
    string tokenUrl;
    string clientId;
    string clientSecret;
|};

public type ResGeneric record {
    int status;
    string message;
};

http:Client taskClient = check new (backendUrl,
    auth = {
        tokenUrl: oauth2Conf.tokenUrl,
        clientId: oauth2Conf.clientId,
        clientSecret: oauth2Conf.clientSecret
        // scopes: "admin"
        // clientConfig: {
        //     secureSocket: {
        //         cert: "../resource/path/to/public.crt"
        //     }
        // }
    }
    // secureSocket = {
//     cert: "../resource/path/to/public.crt"
// }
);

public function main() {
    io:println("================ Task Trigger for Draw ================");

    ResGeneric|error res = taskClient->/draw.post({});
    if res is error {
        io:println("Error triggering the draw, ", res);
    } else {
        io:println("Successfully triggered the draw, ", res.message);
    }
}
