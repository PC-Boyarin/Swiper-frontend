import { useEffect } from 'react';
import { useSocket } from '../../context';
import type { ServerToClientEvents } from '../../types/socket';

type EventHandler<T extends keyof ServerToClientEvents> = (
    ...args: Parameters<ServerToClientEvents[T]>
) => void;

export function useSocketEvent<T extends keyof ServerToClientEvents>(
    event: T,
    handler: EventHandler<T>,
    deps: any[] = []
) {
    const { socket } = useSocket();

    useEffect(() => {
        socket.on(event, handler as any);
        return () => {
            socket.off(event, handler as any);
        };
    }, [event, handler, ...deps]);
}