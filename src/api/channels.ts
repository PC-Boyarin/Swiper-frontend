import type {AxiosResponse} from "axios";
import baseServer from './base'

export const getAllChannels: (body: any) => Promise<AxiosResponse<any[]>> = async (body) => {
    const res = await baseServer.post(`/channels/getAllChannels`, body);
    return res;
};

export const createChannel: (body: any) => Promise<AxiosResponse<any[]>> = async (body) => {
    const res = await baseServer.post(`/channels/createChannel`, body);
    return res;
};
