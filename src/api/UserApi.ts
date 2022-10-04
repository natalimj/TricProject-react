import http from "../util/Http-common";
import IUserData from "../models/User";
import IVoteData from "../models/Vote";
import FinalResult from "../models/FinalResult";

const getAllUsers = () => {
    return http.get<Array<IUserData>>("userApi/users");
};
const createUser = (data: IUserData) => {
    return http.post<IUserData>("userApi/user", data);
};

const saveVote = (data: IVoteData) => {
    return http.post<IVoteData>("userApi/vote", data);
};



const getAppStatus =() =>{
    return http.get<boolean>("userApi/getAppStatus");
}

const getFinalResult= (userId:any) => {
    return http.get<Array<FinalResult>>("userApi/finalResult" ,{
        params: {
            userId: userId
        }
      })
};


const UserApi = {
    getAllUsers,
    createUser,
    saveVote,
    getAppStatus,
    getFinalResult
};
export default UserApi;