import { redirect, useSearchParams, useNavigate } from "react-router-dom";
import * as cts from "../../const";
import { useEffect, useState } from "react";
import axios from "axios";
import { TokenRequest, TokenResponse, Tokens } from "../../dao/login/login.dao";
import { useAppDispatch } from '../../store/hooks';
import { loggedIn } from '../../store/features/user/user.slice';
import { buildUserStateFromIdToken } from '../../utils/json.utils';
import { UserState } from "../../dao/state/state.dao";

const Callback = () => {
    const [authCode, setAuthCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [params, setParams] = useSearchParams();

    useEffect(() => {
        if (!loading) {
            navigate("/");
        }
    }, [loading]);

    useEffect(() => {
        setLoading(true);

        let pkceKeys = JSON.parse(window.sessionStorage.getItem(cts.PKCE_LOCAL_KEY) as string);

        const body: TokenRequest = {
            code: authCode,
            grant_type: cts.AUTH_GRANT_TYPE,
            redirect_uri: cts.REDIRECT_URI,
            code_verifier: pkceKeys.verifier,
            client_id: cts.CLIENT_ID,
        };
        axios
            .post<TokenResponse>(cts.AUTH_TOKEN_URI, new URLSearchParams(body), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
            .then((response) => {
                const tokens: Tokens = {
                    accessToken: response.data.access_token,
                    refreshToken: response.data.refresh_token,
                    expiry: response.data.expires_in,
                    idToken: response.data.id_token,
                    pkceVerifier: pkceKeys.verifier,
                }
                window.sessionStorage.setItem(cts.TOKENS_LOCAL_KEY, JSON.stringify(tokens));

                const user = buildUserStateFromIdToken(tokens.idToken);

                if (user) {
                    dispatch(loggedIn(user as UserState)); 
                }

                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                setError(error);
            });
    }, [authCode]);

    let authCodeStr = params.get("code") as string;
    if (!authCode) {
        redirect("/");
    }

    if (authCode !== authCodeStr) {
        setAuthCode(authCodeStr);
    }

    if (loading) {
        return <div>Loading</div>;
    }
    if (error) {
        return <div>Error {JSON.stringify(error)}</div>;
    }

    return null;
};

export default Callback;
