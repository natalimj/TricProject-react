import http from "../util/Http-common";
import IQuestionData from "../models/Question";
import authHeader from "../services/auth-header";
import IContributorData from "../models/Contributor";
import IPlayInfoData from "../models/PlayInfo";
import { StatusData } from "../reducers/statusSlice";
import IUserData from "../models/User";

const getAllUsers = () => {
  return http.get<Array<IUserData>>("adminApi/users");
};

const endSession = (accessToken: string) => {
  return http.get("adminApi/endSession", { headers: authHeader(accessToken) });
};

const showFinalResult = (accessToken: string) => {
  return http.post("adminApi/showFinalResult", "", { headers: authHeader(accessToken) });
};

const getQuestionByNumber = (questionNumber: number, accessToken: string) => {
  return http.get<IQuestionData>("adminApi/question", {
    params: {
      questionNumber: questionNumber
    },
    headers: authHeader(accessToken)
  })
};

const showQuestion = (questionNumber: number, accessToken: string) => {
  return http.get<IQuestionData>("adminApi/showQuestion", {
    params: {
      questionNumber: questionNumber
    },
    headers: authHeader(accessToken)
  })
};

const activateApp = (accessToken: string) => {
  return http.post<StatusData>("adminApi/activate", "", { headers: authHeader(accessToken) });
};

const deactivateApp = (accessToken: string) => {
  return http.post<StatusData>("adminApi/deactivate", "", { headers: authHeader(accessToken) });
};

const getAllQuestions = (accessToken: string) => {
  return http.get<Array<IQuestionData>>("adminApi/questions", { headers: authHeader(accessToken) });
};

const addQuestion = (question: IQuestionData, accessToken: string) => {
  return http.post<IQuestionData>("adminApi/addQuestion", question, { headers: authHeader(accessToken) });
};

const addQuestionTime = (questionId: any, time: number, accessToken: string) => {
  return http.post<IQuestionData>("adminApi/addQuestionTime", {}, {
    params: {
      questionId: questionId,
      time: time,
    },
    headers: authHeader(accessToken)
  }
  )
};

const deleteQuestion = (questionId: number, accessToken: string) => {
  return http.delete<number>("adminApi/deleteQuestion", {
    params: {
      questionId: questionId
    },
    headers: authHeader(accessToken)
  })
}

const deleteAllQuestions = (accessToken: string) => {
  return http.delete<number>("adminApi/deleteQuestions", {
    headers: authHeader(accessToken)
  })
}

const editQuestion = (question: IQuestionData, accessToken: string) => {
  return http.patch<IQuestionData>("adminApi/editQuestion", question, { headers: authHeader(accessToken) });
};

const getNumberOfQuestions = (accessToken: string) => {
  return http.get<number>("adminApi/numberOfQuestions", { headers: authHeader(accessToken) });
};

const addContributor = (contributor: IContributorData, accessToken: string) => {
  return http.post<IContributorData>("adminApi/contributor", contributor, { headers: authHeader(accessToken) });
};


const editContributor = (contributor: IContributorData, accessToken: string) => {
  return http.patch<IContributorData>("adminApi/editContributor", contributor, { headers: authHeader(accessToken) });
};


const deleteContributor = (contributorId: number, accessToken: string) => {
  return http.delete<number>("adminApi/deleteContributor", {
    params: {
      contributorId: contributorId
    },
    headers: authHeader(accessToken)
  })
}

const editPlayInfo = (playInfo: IPlayInfoData, accessToken: string) => {
  return http.patch<IPlayInfoData>("adminApi/playInfo", playInfo, { headers: authHeader(accessToken) });
};

const displayQuestionForAdmin = (questionNumber: number, accessToken: string) => {
  return http.get<IQuestionData>("adminApi/displayQuestion", {
    params: {
      questionNumber: questionNumber
    },
    headers: authHeader(accessToken)
  })
};

const startCountdown = (timer: number, accessToken: string) => {
  return http.get<number>("adminApi/startCountdown", {
    params: {
      timer: timer
    },
    headers: authHeader(accessToken)
  })
};

const cleanPage = (accessToken: string) => {
  return http.post("adminApi/cleanResultPage", "", { headers: authHeader(accessToken) });
};

const login = (username: string, password: string) => {
  return http.post("authApi/signin", {
    username,
    password
  })
};

const AdminApi = {
  getAllUsers,
  endSession,
  getQuestionByNumber,
  activateApp,
  deactivateApp,
  getAllQuestions,
  addQuestion,
  deleteQuestion,
  deleteAllQuestions,
  editQuestion,
  showFinalResult,
  addQuestionTime,
  showQuestion,
  getNumberOfQuestions,
  addContributor,
  editContributor,
  deleteContributor,
  editPlayInfo,
  displayQuestionForAdmin,
  startCountdown,
  cleanPage,
  login
};
export default AdminApi;