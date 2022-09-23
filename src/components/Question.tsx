import React, { useEffect, useState } from 'react'
import AdminApi from '../api/AdminApi';
import UserApi from '../api/UserApi';
import IQuestionData from '../models/Question';
import IUserData from '../models/User';
import WaitingPage from './WaitingPage';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';


type QuestionProps = { questionNumber: number };

const Question = ({ questionNumber }: QuestionProps) => {

  const initialQuestionState = {
    id: null,
    questionNumber: 0,
    questionText: "",
    answers: []
  };
  const [currentQuestion, setCurrentQuestion] = useState<IQuestionData>(initialQuestionState);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const userId = useAppSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    getQuestion(questionNumber);
  }, []);

  const getQuestion = (no: number) => {
    AdminApi.getQuestionByNumber(no)
      .then((response: any) => {
        setCurrentQuestion(response.data);
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });

  };

  const vote = (answerId: any) => {
    const voteData = {
      userId: userId,
      questionId: currentQuestion.questionId,
      answerId: answerId
    };

    UserApi.saveVote(voteData)
      .then((response: any) => {
        console.log(response.data);
        sessionStorage.setItem("answerId", answerId);
      })
      .catch((e: Error) => {
        console.log(e);
      });

    console.log("vote: " + answerId);
    setSubmitted(true);
  };


  return (
    <div>
      <p><b>QuestionPage {currentQuestion.questionId}</b></p>
      {submitted ? (
        (<WaitingPage />)
      ) : (
        <div>
          <div>
            <p>Question : {currentQuestion.questionText}</p>
            {currentQuestion.answers && currentQuestion.answers.map((answer) => (
              <button onClick={() => vote(answer.answerId)} className="btn btn-success">
                <p>{answer.answerText.toString()}</p>
              </button>
            ))}
          </div>
        </div>)}
    </div>
  )
}
export default Question