export interface ServerToClientEvents {
	// События от сервера к клиенту
	'message:new': (message: { id: string; text: string; userId: string; timestamp: number }) => void;
	'user:joined': (user: { id: string; username: string }) => void;
	'user:left': (userId: string) => void;
	'typing:start': (userId: string) => void;
	'typing:stop': (userId: string) => void;
	'error': (error: { message: string }) => void;
}

export interface ClientToServerEvents {
	// События от клиента к серверу
	'message:send': (data: { text: string; roomId: string }) => void;
	'room:join': (roomId: string) => void;
	'room:leave': (roomId: string) => void;
	'typing:start': (roomId: string) => void;
	'typing:stop': (roomId: string) => void;
}