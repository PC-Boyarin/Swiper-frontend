import type {AxiosResponse} from "axios";
import baseServer from './base'
import { useQuery } from '@tanstack/react-query';

export const getAllChannels: (body: any) => Promise<AxiosResponse<any[]>> = async (body) => {
    const res = await baseServer.post(`/channels/getAllChannels`, body);
    return res;
};

export const createChannel: (body: any) => Promise<AxiosResponse<any[]>> = async (body) => {
    const res = await baseServer.post(`/channels/createChannel`, body);
    return res;
};

export const getCurrentChannels: (body: any) => Promise<AxiosResponse<any[]>> = async (body) => {
    const res = await baseServer.post(`/channels/currentChannel`, body);
    return res;
};


export const channelKeys = {
    all: ['servers'] as const,
    lists: () => [...channelKeys.all, 'list'] as const,
    list: (userId: number) => [...channelKeys.lists(), userId] as const,
    details: () => [...channelKeys.all, 'detail'] as const,
    detail: (id: number) => [...channelKeys.details(), id] as const,
};

export const useCurrentChannel = (channelId: number | null | undefined) => {
    return useQuery({
        queryKey: channelKeys.list(channelId!),
        queryFn: () => getCurrentChannels({ channel_id: channelId! }),
        enabled: !!channelId,
        staleTime: 5 * 60 * 1000,
        select: (data) => data?.data,
    });
};

