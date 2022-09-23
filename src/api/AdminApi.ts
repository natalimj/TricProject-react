import http from "../util/Http-common";
import IQuestionData from "../models/Question";
import IResultData from "../models/Result";

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

const showNextQuestion = (id :number) => {
  return http.get<IQuestionData>(`questionApi/next/${id}`);
};

const AdminApi = {
  endSession,
  showResult,
  getQuestionByNumber,
  showNextQuestion
};
export default AdminApi;