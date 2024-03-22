import ballerina/http;
import lotto.dao;

public isolated function createForbiddenError(string code, string detail) returns http:Forbidden {
    return {
        body:  createErrorResp(code, detail)
    };
}

public isolated function createUnauthorizedError(string code, string detail) returns http:Unauthorized {
    return {
        body:  createErrorResp(code, detail)
    };
}

public isolated function createInternaServerError(string code, string detail) returns http:InternalServerError {
    return {
        body:  createErrorResp(code, detail)
    };
}

public isolated function createBadRequest(string code, string detail) returns http:BadRequest {
    return {
        body:  createErrorResp(code, detail)
    };
}

isolated function createErrorResp(string code, string detail) returns dao:ResGenericError {
    return {
        code,
        detail
    };
}