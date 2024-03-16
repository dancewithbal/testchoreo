# Description.
public configurable JwtAssertionConfig jwt = ?;

# Description.
#
# + iss - field description  
# + aud - field description  
# + jwksEndpoint - field description  
# + cacheCap - field description  
# + cacheCleanupInterval - field description  
# + cacheMaxAge - field description
public type JwtAssertionConfig record {|
    string iss;
    string[] aud;
    string jwksEndpoint;
    int cacheCap;
    decimal cacheCleanupInterval;
    decimal cacheMaxAge;
|};

