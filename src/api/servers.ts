import type {AxiosResponse} from "axios";
import baseServer from './base'

// export const createServer: (body: any) => Promise<AxiosResponse<any[]>> = async (body) => {
//     return await baseServer.post(`/servers/createServer`, body);
// };
//
export const getAllServers: (body: any) => Promise<AxiosResponse<any[]>> = async (body) => {
    return await baseServer.post(`/servers/getAllServers`, body);
};

import { useQuery } from '@tanstack/react-query';

interface Server {
    id: number;
    name: string;
    owner_id: number;
}

interface GetAllServersParams {
    user_id: number;
}

export const serverKeys = {
    all: ['servers'] as const,
    lists: () => [...serverKeys.all, 'list'] as const,
    list: (userId: number) => [...serverKeys.lists(), userId] as const,
    details: () => [...serverKeys.all, 'detail'] as const,
    detail: (id: number) => [...serverKeys.details(), id] as const,
};

export const useServers = (userId: number | null | undefined) => {
    return useQuery({
        queryKey: serverKeys.list(userId!),
        queryFn: () => getAllServers({ user_id: userId! }),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        select: (data) => data?.data,
    });
};
