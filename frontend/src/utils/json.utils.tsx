import { Claims, Tokens } from '../dao/login/login.dao';
import { UserState } from '../dao/state/state.dao';

export const buildUserState: (tokenStr: string|null) => UserState|null = (tokenStr: string|null) => {
    if (!tokenStr) {
        return null;
    }
    try {
        const tokens: Tokens = JSON.parse(tokenStr);
        return buildUserStateFromIdToken(tokens.idToken);
    } catch (error) {
        console.error('Error decoding ID token:', error);
    }
    return null;
}

export const buildUserStateFromIdToken: (idToken: string) => UserState|null = (idToken: string) => {
    try {
        // Decode the ID token
        const payloadBase64 = idToken.split('.')[1];
        const decodedPayload = atob(payloadBase64);
        const claims: Claims = JSON.parse(decodedPayload);

        // Access the claims
        const { sub, email, given_name, name, family_name, picture } = claims;
        const user: UserState = {
            loggedIn: true,
            id: sub,
            givenName: given_name,
            familyName: family_name,
            fullName: name,
            email: email,
            picture: picture
        }
        return user;
    } catch (error) {
        console.error('Error decoding ID token:', error);
    }
    return null;
}