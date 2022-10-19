import http from "../util/Http-common";
import IUserData from "../models/User";
import IVoteData from "../models/Vote";
import FinalResult from "../models/FinalResult";
import IResultData from "../models/Result";
import IContributorData from "../models/Contributor";
import IPlayInfoData from "../models/PlayInfo";

const getAllUsers = () => {
    return http.get<Array<IUserData>>("userApi/users");
};

const createUser = (data: IUserData) => {
    return http.post<IUserData>("userApi/user", data);
};

const saveVote = (data: IVoteData) => {
    return http.post<IVoteData>("userApi/vote", data);
};

const getAppStatus = () => {
    return http.get<boolean>("userApi/getAppStatus");
}

const showResult = (questionId: any) => {
    return http.get<IResultData>("userApi/result", {
        params: {
            questionId: questionId
        }
    })
};

const getFinalResult = (userId: any) => {
    return http.get<Array<FinalResult>>("userApi/finalResult", {
        params: {
            userId: userId
        }
    })
};

const getCast = () => {
    return http.get<Array<IContributorData>>("userApi/cast");
};

const getDevTeam = () => {
    return http.get<Array<IContributorData>>("userApi/devTeam");
};


const getPlayInfo = () => {
    return http.get<IPlayInfoData>("userApi/getPlayInfo");
  };

const UserApi = {
    getAllUsers,
    createUser,
    saveVote,
    getAppStatus,
    showResult,
    getFinalResult,
    getCast,
    getDevTeam,
    getPlayInfo
};
export default UserApi;