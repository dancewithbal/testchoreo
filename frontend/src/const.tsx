declare const window: {
    env: {
        authLoginUri: string;
        authLogoutUri: string;
        authScope: string;
        authRespType: string;
        authRedirectUri: string;
        authClientId: string;
        authCodeChallengeMethod: string;

        authTokenUri: string;
        authGrantType: string;

        backendBaseUrl: string;
    }
};

export const PKCE_LOCAL_KEY = "pkce_code";
export const TOKENS_LOCAL_KEY = "tokens";

export const AUTH_LOGIN_URI = window.env.authLoginUri;
export const AUTH_LOGOUT_URI = window.env.authLogoutUri;
export const SCOPE = window.env.authScope;
export const RESP_TYPE = window.env.authRespType;
export const REDIRECT_URI = window.env.authRedirectUri;
export const CLIENT_ID = window.env.authClientId;
export const CODE_CHALLENGE_METHOD = window.env.authCodeChallengeMethod;

export const AUTH_TOKEN_URI = window.env.authTokenUri;
export const GRANT_TYPE = window.env.authGrantType;

export const BACKEND_BASE_URL = window.env.backendBaseUrl;
