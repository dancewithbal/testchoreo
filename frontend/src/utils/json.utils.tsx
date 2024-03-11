import { Claims } from '../dao/login/login.dao';

export const getEmail: (idToken: string) => string = (idToken: string) => {
    try {
        // Decode the ID token
        const payloadBase64 = idToken.split('.')[1];
        const decodedPayload = atob(payloadBase64);
        const claims: Claims = JSON.parse(decodedPayload);

        // Access the claims
        const { email } = claims;
        return email;
    } catch (error) {
        console.error('Error decoding ID token:', error);
    }
    return "";
}