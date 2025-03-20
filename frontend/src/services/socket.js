import { io } from 'socket.io-client';
import { getAuthToken } from './auth';

const socket = io('https://api.lecoindls.site', {
    auth: {
        token: getAuthToken()
    }
});

export default socket;