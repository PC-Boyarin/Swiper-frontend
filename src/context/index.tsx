import React, { createContext, useContext, type ReactNode, useState, useEffect } from 'react';
import { socket, connectSocket, disconnectSocket } from '../services';

interface SocketContextType {
    isConnected: boolean;
    connect: (token?: string) => void;
    disconnect: () => void;
    socket: typeof socket;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
    children: ReactNode;
    shouldConnect?: boolean;
    token?: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
   children,
   shouldConnect = true,
   token
}) => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        // Обработчики событий подключения
        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);
        const onConnectError = (err: Error) => {
            console.error('Socket connection error:', err);
            setIsConnected(false);
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onConnectError);

        // Автоподключение если нужно
        if (shouldConnect && !socket.connected) {
            connectSocket(token);
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onConnectError);
        };
    }, [shouldConnect, token]);

    const value = {
        isConnected,
        connect: connectSocket,
        disconnect: disconnectSocket,
        socket,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};