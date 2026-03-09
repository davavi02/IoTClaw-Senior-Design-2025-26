import * as SecureStore from 'expo-secure-store';

const JWT_SECURE = 'userJWT';
const BASE_URL = 'http://34.174.243.193:20206'

/*
    In your component add:
    import { callProtectedRoute } from '../services/ApiService';

    See ShopButton for example POST
    See ShopScreen for example GET

    Example:
    const response = await callProtectedRoute('/api/address', {
        method: 'POST',
        body: addyData,
    });
*/

export const callProtectedRoute = async (endpoint: string, options: RequestInit = {}) => {
    const jwt = await SecureStore.getItemAsync(JWT_SECURE);

    if(!jwt) {
        throw new Error("Auth error: No JWT found.");
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
    };

    return fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
};