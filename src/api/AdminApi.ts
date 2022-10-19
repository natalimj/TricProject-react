import http from "../util/Http-common";
import IQuestionData from "../models/Question";
import IStatusData from "../models/Status";
import authHeader from "../services/auth-header";
import IContributorData from "../models/Contributor";
import IPlayInfoData from "../models/PlayInfo";

const endSession = () => {
  return http.get("adminApi/endSession", { headers: authHeader() });
};

const showFinalResult = () => {
  return http.post("adminApi/showFinalResult", "", { headers: authHeader() });
};

const getQuestionByNumber = (questionNumber: number) => {
  return http.get<IQuestionData>("adminApi/question", {
    params: {
      questionNumber: questionNumber
    },
    headers: authHeader()
  })
};

const showQuestion = (questionNumber: number) => {
  return http.get<IQuestionData>("adminApi/showQuestion", {
    params: {
      questionNumber: questionNumber
    },
    headers: authHeader()
  })
};

const activateApp = () => {
  return http.post<IStatusData>("adminApi/activate", "", { headers: authHeader() });
};

const getAllQuestions = () => {
  return http.get<Array<IQuestionData>>("adminApi/questions", { headers: authHeader() });
};

const addQuestion = (questionText: string, firstAnswer: string, secondAnswer: string) => {
  return http.post<IQuestionData>("adminApi/addQuestion", {}, {
    params: {
      questionText: questionText,
      firstAnswer: firstAnswer,
      secondAnswer: secondAnswer
    },
    headers: authHeader()
  }
  )
};

const addQuestionTime = (questionId: any, time: number) => {
  return http.post<IQuestionData>("adminApi/addQuestionTime", {}, {
    params: {
      questionId: questionId,
      time: time,
    },
    headers: authHeader()
  }
  )
};

const deleteQuestion = (questionId: number) => {
  return http.delete<number>("adminApi/deleteQuestion", {
    params: {
      questionId: questionId
    },
    headers: authHeader()
  })
}

const editQuestion = (questionText: string, firstAnswer: string, secondAnswer: string, questionId: number) => {
  return http.patch<IQuestionData>("adminApi/editQuestion", {}, {
    params: {
      questionText: questionText,
      firstAnswer: firstAnswer,
      secondAnswer: secondAnswer,
      questionId: questionId
    },
    headers: authHeader()
  }
  )
}

const getNumberOfQuestions = () => {
  return http.get<number>("adminApi/numberOfQuestions", { headers: authHeader() });
};

const addContributor = (contributor: IContributorData) => {
  return http.post<IContributorData>("adminApi/contributor", contributor, { headers: authHeader() });
};


const editContributor = (contributor: IContributorData) => {
  return http.patch<IContributorData>("adminApi/editContributor", contributor, { headers: authHeader() });
};


const deleteContributor = (contributorId: number) => {
  return http.delete<number>("adminApi/deleteContributor", {
    params: {
      contributorId: contributorId
    },
    headers: authHeader()
  })
}

const editPlayInfo = (playInfo: IPlayInfoData) => {
  return http.patch<IPlayInfoData>("adminApi/playInfo", playInfo, { headers: authHeader() });
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