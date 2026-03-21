import { io, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '../types/socket';

// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';
const SOCKET_URL = 'http://localhost:3001'
// Создаем типизированный сокет
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL, {
    autoConnect: false, // Контролируем подключение вручную
    reconnection: true,
    reconnectionAttempts: 5,
    withCredentials: true,
    reconnectionDelay: 1000,
    transports: ['websocket'], // Опционально: только WebSocket
});

// Функции для управления подключением
export const connectSocket = (token?: string) => {
    if (token) {
        socket.auth = { token }; // Для аутентификации
    }
    socket.connect();
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};