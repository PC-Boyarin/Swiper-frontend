import type {AxiosResponse} from "axios";
import baseServer from './base'
import type {UserRoomType} from "../types";

export const getUserRoomsApi: () => Promise<AxiosResponse<UserRoomType[]>> = async () => {
	return await baseServer.get('/rooms');
};
