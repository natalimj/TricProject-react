import http from "../util/Http-common";
import IQuestionData from "../models/Question";
import IResultData from "../models/Result";
import IStatusData from "../models/Status";

const endSession = () => {
  return http.post("adminApi/endSession");
};

const showFinalResult = () => {
  return http.post("adminApi/showFinalResult");
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


const activateApp = () => {
  return http.post<IStatusData>("adminApi/activate");
};

const getAllQuestions = () => {
  return http.get<Array<IQuestionData>>("adminApi/questions");
};

const addQuestion = (questionText: string, firstAnswer: string, secondAnswer:string) => {
  return http.post<IQuestionData>("adminApi/addQuestion", {},{
    params: {
      questionText:questionText,
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

const editQuestion=(questionText:string, firstAnswer: string, secondAnswer:string, questionId:number) =>{
  return http.patch<IQuestionData>("adminApi/editQuestion",{},{
    params:{
      questionText: questionText,
      firstAnswer:firstAnswer,
      secondAnswer: secondAnswer,
      questionId: questionId
    }
  }
  )
}

const AdminApi = {
  endSession,
  showResult,
  getQuestionByNumber,
  activateApp ,
  getAllQuestions,
  addQuestion,
  deleteQuestion,
  editQuestion,
  showFinalResult
};
export default AdminApi;