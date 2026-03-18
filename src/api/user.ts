import type {AxiosResponse} from "axios";
import baseServer from './base'
import type {MessageType} from "../types/messageType.ts";
import type {User} from "../types/userType.ts";


export const createUser: (body: any) => Promise<AxiosResponse<any[]>> = async (body) => {
	return await baseServer.post(`/auth/register`, body);
};

export const loginUser: (body: any) => Promise<AxiosResponse<any>> = async(body) => {
	return await baseServer.post('/auth/login', body)
}

export const checkAuthenticated: () => Promise<AxiosResponse> = async() => {
	return await baseServer.get('/auth/checkAuthenticated')
}

export const logoutUser: () => Promise<AxiosResponse<any>> = async() => {
	return await baseServer.get('/auth/logout')
}

export const searchUser: (username: string) => Promise<AxiosResponse<any>> = async(username: string) => {
	return await baseServer.post('/user/search', {username: username, id: 3})
}

export const getUser: () => Promise<AxiosResponse<any>> = async() => {
	return await baseServer.get(`/user`)
}

export const changeUser: (body: User) => Promise<AxiosResponse<any>> = async(body) => {
	return await baseServer.put('/user/update', body)
}

export const updateMessage: (body: MessageType) => Promise<AxiosResponse<any>> = async (body) => {
	return await baseServer.put('/messages/update', body)
}
