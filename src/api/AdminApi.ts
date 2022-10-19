import http from "../util/Http-common";
import IQuestionData from "../models/Question";
import IStatusData from "../models/Status";
import authHeader from "../services/auth-header";
import IContributorData from "../models/Contributor";
import IPlayInfoData from "../models/PlayInfo";

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
  return http.post<IStatusData>("adminApi/activate", "", { headers: authHeader(accessToken) });
};

const getAllQuestions = (accessToken: string) => {
  return http.get<Array<IQuestionData>>("adminApi/questions", { headers: authHeader(accessToken) });
};

const addQuestion = (questionText: string, firstAnswer: string, secondAnswer: string, accessToken: string) => {
  return http.post<IQuestionData>("adminApi/addQuestion", {}, {
    params: {
      questionText: questionText,
      firstAnswer: firstAnswer,
      secondAnswer: secondAnswer
    },
    headers: authHeader(accessToken)
  }
  )
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

const editQuestion = (questionText: string, firstAnswer: string, secondAnswer: string, questionId: number, accessToken: string) => {
  return http.patch<IQuestionData>("adminApi/editQuestion", {}, {
    params: {
      questionText: questionText,
      firstAnswer: firstAnswer,
      secondAnswer: secondAnswer,
      questionId: questionId
    },
    headers: authHeader(accessToken)
  }
  )
}

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


const AdminApi = {
  endSession,
  getQuestionByNumber,
  activateApp,
  getAllQuestions,
  addQuestion,
  deleteQuestion,
  editQuestion,
  showFinalResult,
  addQuestionTime,
  showQuestion,
  getNumberOfQuestions,
  addContributor,
  editContributor,
  deleteContributor,
  editPlayInfo
};
export default AdminApi;