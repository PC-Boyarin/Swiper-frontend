import { useCallback } from 'react';
import { useSocket } from '../../context';
import type { ClientToServerEvents } from '../../types/socket';

export function useSocketEmit() {
    const { socket, isConnected } = useSocket();

    const emit = useCallback(<T extends keyof ClientToServerEvents>(
        event: T,
        ...args: Parameters<ClientToServerEvents[T]>
    ) => {
        if (!isConnected) {
            console.warn('Socket not connected, cannot emit event');
            return;
        }
        socket.emit(event, ...args);
    }, [socket, isConnected]);

    return { emit };
}