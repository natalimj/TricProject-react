import http from "../util/Http-common";
import IUserData from "../models/User";
import IVoteData from "../models/Vote";

const getAllUsers = () => {
    return http.get<Array<IUserData>>("userApi/users");
};
const createUser = (data: IUserData) => {
    return http.post<IUserData>("userApi/user", data);
};

const saveVote = (data: IVoteData) => {
    return http.post<IVoteData>("userApi/vote", data);
};
const UserApi = {
    getAllUsers,
    createUser,
    saveVote
};
export default UserApi;