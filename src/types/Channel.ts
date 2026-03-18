export interface Channel {
    id: number;
    server_id: number;
    category_id: number | null;
    name: string;
    topic: string | null;
    type: 'text' | 'voice' | 'announcement' | 'stage' | 'forum';
    position: number;
    is_private: boolean;
    created_by: number;
    created_at: string;
    updated_at: string;
    archived_at: string | null;
}

export interface CreateChannelDto {
    server_id: number;
    name: string;
    type: Channel['type'];
    category_id?: number | null;
    topic?: string;
    is_private?: boolean;
}