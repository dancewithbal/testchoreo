import ballerina/http;

service /backend on new http:Listener(8090) {
    resource function post /test1(@http:Payload string textMsg) returns string {
        return "hello" + textMsg;
    }
}