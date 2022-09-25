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

const getAllQuestions = () => {
  return http.get<Array<IQuestionData>>("adminApi/questions");
};

//delete, add and edit question

const addQuestion = (question: string, firstAnswer: string, secondAnswer:string) => {
  return http.post<IQuestionData>("adminApi/addQuestion", {},{
    params: {
      question:question,
      firstAnswer: firstAnswer,
      secondAnswer:secondAnswer
    }
  }
  )
};

const deleteQuestion =( questionId: number) =>{
  return http.delete<number>("adminApi/deleteQuestion",{
    params: {
      questionId: questionId
    }
  }) 
}

const AdminApi = {
  endSession,
  showResult,
  getQuestionByNumber,
  showNextQuestion,
  getAllQuestions,
  addQuestion,
  deleteQuestion
};
export default AdminApi;