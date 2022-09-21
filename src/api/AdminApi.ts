import http from "../util/Http-common";
import IQuestionData from "../types/Question";
import IResultData from "../types/Result";

const startSession = () => {
  return getQuestionByNumber(1);
};

const endSession = () => {
  return http.post("adminApi/endSession");
};

const showResult = (questionId: any) => {
  return http.get<IResultData>("adminApi/result", {
    params: {
      questionId: questionId
    }
  })
};

const getQuestionByNumber = (questionNumber: number) => {
  return http.get<IQuestionData>("adminApi/question", {
    params: {
      questionNumber: questionNumber
    }
  })
};

const AdminApi = {
  startSession,
  endSession,
  showResult,
  getQuestionByNumber
};
export default AdminApi;