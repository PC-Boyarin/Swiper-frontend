import { io, Socket } from 'socket.io-client';

// Определение типов для событий (Server -> Client, Client -> Server)
// Это обеспечит type-safety [citation:2][citation:8]
export interface ServerToClientEvents {
    'chat:message': (message: { id: string; content: string; userId: string; timestamp: Date }) => void;
    'user:joined': (user: { id: string; username: string }) => void;
    'user:left': (userId: string) => void;
    'error': (error: { message: string }) => void;
    // ... другие события от сервера
}

export interface ClientToServerEvents {
    'chat:send': (message: { content: string; channelId: string }) => void;
    'user:join-channel': (channelId: string) => void;
    'user:leave-channel': (channelId: string) => void;
    'typing:start': (channelId: string) => void;
    'typing:stop': (channelId: string) => void;
    // ... другие события от клиента
}

// URL сервера. В production можно заменить на переменную окружения
// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000';
const SOCKET_URL = 'http://217.177.74.174:5173';

// Создаём типизированный сокет [citation:2]
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL, {
    autoConnect: false, // Контролируем подключение вручную [citation:1]
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket'], // Опционально: принудительно использовать WebSocket
});

// Функция для подключения (можно вызывать после авторизации)
export const connectSocket = (token?: string) => {
    if (token) {
        socket.auth = { token }; // Передаём токен для аутентификации на сервере [citation:2]
    }
    socket.connect();
};

// Функция для отключения
export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};