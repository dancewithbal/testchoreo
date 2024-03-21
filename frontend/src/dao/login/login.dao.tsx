export interface Tokens {
    readonly accessToken: string;
    readonly refreshToken: string;
    readonly expiry: number;
    readonly idToken: string;
    readonly pkceVerifier: string;
}

export interface TokenRequest extends Record<string, string> {
    readonly code: string;
    readonly grant_type: string;
    readonly redirect_uri: string;
    readonly code_verifier: string;
    readonly client_id: string;
}

export interface TokenResponse {
    readonly access_token: string;
    readonly refresh_token: string;
    readonly expires_in: number;
    readonly id_token: string;
}

export interface RefreshTokenRequest extends Record<string, string> {
    readonly refresh_token: string;
    readonly grant_type: string;
    readonly redirect_uri: string;
    readonly code_verifier: string;
    readonly client_id: string;
}

export interface PkceKeys {
    readonly challenge: string;
    readonly verifier: string;
}

export interface Claims {
    sub: string;
    email: string;
    given_name: string;
    name: string;
    family_name: string;
    picture: string;
}

export interface LogoutRequest extends Record<string, string> {
    readonly client_id: string;
    readonly post_logout_redirect_uri: string;
    readonly state: string;
}

