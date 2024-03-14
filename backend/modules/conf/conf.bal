public configurable CorsConfig cors = ?;

public type CorsConfig record {
    string[] allowOrigins;
    boolean allowCredentials;
};

