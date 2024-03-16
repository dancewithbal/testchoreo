import axios from "axios";
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import * as cts from '../const';
import { useAppDispatch } from '../store/hooks';
import { loggedOut } from '../store/features/user/user.slice';
import { RefreshTokenRequest, TokenResponse, Tokens } from "../dao/login/login.dao";

const refreshAxios = axios.create({
    baseURL: cts.BACKEND_BASE_URL,
    withCredentials: true
});

const plainAxios = axios.create({
    baseURL: cts.AUTH_TOKEN_URI,
    withCredentials: true
});

// Use interceptor to inject the token to requests
refreshAxios.interceptors.request.use((request) => {
    const loggedInTokens = window.sessionStorage.getItem(cts.TOKENS_LOCAL_KEY);

    if (loggedInTokens) {
        const tokens: Tokens = JSON.parse(loggedInTokens);
        request.headers[cts.BACKEND_AUTH_HEADER_NAME] = `${cts.BACKEND_AUTH_HEADER_VALUE_PREFIX}${tokens.accessToken}`;
    }
    return request;
});

// curl -k -d "grant_type=refresh_token&refresh_token=<refresh_token>" -H "Authorization: Basic <Base64Encoded(Client_Id:Client_Secret)>" -H "Content-Type: application/x-www-form-urlencoded" https://localhost:9443/oauth2/token

// Function that will be called to refresh authorization
const refreshAuthLogic = (failedRequest: any) => {
    const loggedInTokens = window.sessionStorage.getItem(cts.TOKENS_LOCAL_KEY);
    if (!loggedInTokens) {
        // TODO check what happens here 
        return new Promise((_, reject) => reject());
    }
    const tokens: Tokens = JSON.parse(loggedInTokens);
    const body: RefreshTokenRequest = {
        grant_type: cts.AUT_REFRESH_GRANT_TYPE,
        redirect_uri: cts.REDIRECT_URI,
        code_verifier: tokens.pkceVerifier,
        refresh_token: tokens.refreshToken,
        client_id: cts.CLIENT_ID,
    };

    return plainAxios.post<TokenResponse>("", new URLSearchParams(body), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }).then((response) => {
        const newTokens: Tokens = {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiry: response.data.expires_in,
            idToken: response.data.id_token,
            pkceVerifier: tokens.pkceVerifier,
        }
        console.log("========Refresh call response ======" + response.data);
        window.sessionStorage.setItem(cts.TOKENS_LOCAL_KEY, JSON.stringify(newTokens));
        failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokens.accessToken;
        return Promise.resolve();
    }).catch((error) => {
        console.log("========Refresh call Failed ======" + error);
        var dispatch = useAppDispatch();
        window.sessionStorage.removeItem(cts.TOKENS_LOCAL_KEY);
        dispatch(loggedOut());
        return Promise.reject();
    });

}
// Instantiate the interceptor
createAuthRefreshInterceptor(refreshAxios, refreshAuthLogic);

export default refreshAxios;


